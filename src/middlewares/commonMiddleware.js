const JWT = require('jsonwebtoken')
const BlogModel = require('../models/blogModel')
const ObjectId = require('mongoose').Types.ObjectId

//  =========================== Authentication ================================ //

const authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(404).send({ status: false, msg: "token must be present" })

        let validateToken = JWT.verify(token, "-- plutonium-- project-blogging-site -- secret-token --")
        if (!validateToken) return res.status(404).send({ status: false, msg: "invalid token" })

        req.validateToken = validateToken
        next()
    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

//  ===================== Authorization ==================================== //

const authorization = async (req, res, next) => {

    try {
        let blogId = req.params.blogId

        if (blogId) {
            if (!ObjectId.isValid(blogId)) return res.status(400).send({ status: false, msg: "Invalid blogId" })

            let blog = await BlogModel.findOne({_id: blogId, isDeleted: false})
            if (!blog) return res.status(400).send({ status: false, msg: "blog doesn't exist" })
    
            let userId = req.validateToken.userId
    
            if (userId != blog.authorId) return res.status(404).send({ status: false, msg: 'you are not authorised' })
        }

        next()

    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
}

module.exports = { authentication, authorization }
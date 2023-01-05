const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://manudeep_:Iforgotmypassword%4012@cluster0.dev1id6.mongodb.net/Blogging-p1",
    {
        useNewUrlParser: true
    })
    .then(() => console.log("Database connected..."))
    .catch(err => console.log(err));


app.use('/', route);

app.use((req, res, next) => {
    const error = new Error('/ Path not found /');
    return res.status(404).send({status: 'ERROR', error: error.message})
});


app.listen(process.env.PORT || 3000, () => {
    console.log('Express app listening on port ' + (process.env.PORT || 3000))
});

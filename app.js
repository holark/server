const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoute = require('./routes/user')
const cors = require('cors');

const db = "mongodb://127.0.0.1:27017/userdb"

mongoose.connect(db, { useNewUrlParser: true})
mongoose.connection.on('error', err => {
    console.log('connection is failed')
});

mongoose.connection.on('connected', connected => {
    console.log('connected with database...')
})
app.use(express.json(), express.urlencoded({ extended: false}))
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

app.use(cors());
app.use('/', userRoute)

// app.get('/login', (req, res) => {
//     res.render('login')
// })

app.use((req, res, next) => {
    res.status(404).json({msg: 'url not found'});
})

module.exports = app;
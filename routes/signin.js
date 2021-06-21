// sign-in route

const express = require('express');
const userLogin = require('../models/signin');
const bodyparser = require('body-parser');

const jsonparser = bodyparser.json();

const signin = express.Router();

signin.post('/',jsonparser,(req,res) => {
    const validCeds = userLogin(req.body)
        .then((token) => res.header('x-auth-token',token).send("Login successful"))
        .catch((err) => console.log(err));
});

module.exports = signin;
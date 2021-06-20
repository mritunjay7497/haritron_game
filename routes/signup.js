const express = require('express');

const jsonparser = require('body-parser').json();

// sigup model
const {userRegistration} = require('../models/signup');

const signup = express.Router();

/* 
New user registration on the plattform
Successful registration returns a jsonwebtoken in the response header.
This token is then stored and will be used to recongnise user on the plattform
*/

signup.post('/',jsonparser,(req,res) => {
    const registerUser = userRegistration(req.body)
        .then((data) => res.header('x-auth-token',data.token).send(data.response))
        .catch((err) => res.status(500).send(err))
})

module.exports = signup;
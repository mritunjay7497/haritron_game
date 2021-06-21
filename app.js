const express = require('express');
const dotenv = require('dotenv');

// Signup route
const signup = require('./routes/signup');

// Sign-in route
const signin = require('./routes/signin');

// load .env into process environment variables
dotenv.config()


const app = express();

// use signup route
app.use('/api/signup',signup);

// use sign-in route
app.use('/api/signin',signin);

// PORT from env file
const port = process.env.PORT || 3000;

// initialize the server
app.listen(port,() => console.log(`Server started on port ${port}`));
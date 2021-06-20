const express = require('express');
const dotenv = require('dotenv');

// Signup route
const signup = require('./routes/signup');

// load .env into process environment variables
dotenv.config()


const app = express();

// use signup route
app.use('/api/signup',signup);

// PORT from env file
const port = process.env.PORT || 3000;

// initialize the server
app.listen(port,() => console.log(`Server started on port ${port}`));
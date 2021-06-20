const express = require('express');
const dotenv = require('dotenv');

// load .env into process environment variables
dotenv.config()



const app = express();

// PORT from env file
const port = process.env.PORT;

// initialize the server
app.listen(port,() => console.log(`Server started on port ${port}`));
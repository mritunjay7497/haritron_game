/*
This middleware provides validation function for using the JWT.
This validates if the username and passsword entered by the user is correct or not
*/

const jwt = require('jsonwebtoken');
const secret = process.env.secret;

function authorize(req,res,next){
    // Get token from the request header
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).send("Access Denied. Please try again with valid credential");
    } else{
        try {
            const payload = jwt.verify(token,secret);
            req.user = payload;
            next();
        } catch (excp) {
            res.status(400).send("Invalid credentials")
        }
    }
};

module.exports = authorize;
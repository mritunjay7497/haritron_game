/*
This module register a new user in the database
This module is to be consumed by /router/signup.js route file
*/

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const lodash = require('lodash');
const dotnev = require('dotenv');
const bcrypt = require('bcrypt');

dotnev.config()

const dbURI = process.env.database;
const secret = process.env.secret;

// connect to the database
mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log("Connected to the user database"))
    .catch((err) => console.log(err));


// User schema
const userSchema = new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    Email:{
        type:String,
        required:true,
        minlength:8,
        maxlength:50,
        unique:true
    },
    password:{
        required:true,
        type:String,
        minlength:10,
        maxlength:100,
    },
    username:{
        required:true,
        type:String,
        unique:true,
        minlength:6,
        maxlength:20
    },
    phone:{
        required:true,
        type:String,
        minlength:10,
        maxlength:10
    }
})

// Generate token method
userSchema.methods.getAuthToken = () => {
   const token = jwt.sign({
       _id: this.id,
       username: this.username,
       Email: this.Email,
       password: this.password,
       phone: this.phone
   }, secret);

   return token;
};

// User model
const userModel = new mongoose.model('Registered_User',userSchema)

async function userRegistration(data){
    // check if the user is already registered
    const isPresent = await userModel.findOne({Email:data.Email});


    if(!isPresent){ 

        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(data.password,salt);


        const user = await userModel({
            Name: data.Name,
            Email: data.Email,
            password: hashedPassword,
            username: data.username,
            phone: data.phone
        });

        await user.save();
        const token = user.getAuthToken();
        
        const response = lodash.pick(user,['Name','Email','username','phone'])

        return {token,response}
    } else{
        const response = "User is already registered.\nTry logging-in instead"
        return {response};
    }
}

module.exports = {userModel,userRegistration}
/*
Sign-in route
* @param  login parameter = [username,password]
* returns jwt-token in 'x-auth-token' response header
*/

const {userModel} = require('./signup');
const bcrypt = require('bcrypt');

async function userLogin(data){
    let isRegistered = await userModel.findOne({username:data.username})

    if(isRegistered){
        let username = data.username;
        let hashedPassword = isRegistered.password;
        let password = data.password;

        const validPassword = await bcrypt.compare(password,hashedPassword)
        if(validPassword){
            const token = isRegistered.getAuthToken();
            return token;
        } else{
            return "Invalid username or password."
        }
    } else{
        return "Invalid username or password."
    }

};

module.exports = userLogin;
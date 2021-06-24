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
        let msg = '';
        let hashedPassword = isRegistered.password;
        let password = data.password;

        const validPassword = await bcrypt.compare(password,hashedPassword)
        if(validPassword){
            const token = isRegistered.getAuthToken();
            msg = 'Login successfull';
            return {token,msg};
        } else{
            const token = null;
            msg =  "Invalid username or password."
            return {token,msg};
        }
    } else{
        msg =  "Invalid username or password.";
        const token = null;
        return {token,msg};
    }

};

module.exports = userLogin;
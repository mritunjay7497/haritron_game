/*
This module provides the wallet schema and wallet model.
It is to be consumed by './router/wallet'
*/

const mongoose = require('mongoose');
const dotnev = require('dotenv');
const { userModel } = require('./signup');
const { toInteger } = require('lodash');

dotnev.config()
const dbURI = process.env.database;

mongoose.connect(dbURI,{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('connected to the wallet database'))
    .catch((err) => console.log(err))

// Wallet schema
const walletSchema = new mongoose.Schema({
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        unique:true,
        ref:'Registered_User'
    },
    Balance:{
        type:Number,
        required:true,
        default:0
    }
});

// Prepeare wallet model
const walletModel = new mongoose.model('wallet',walletSchema);


// Create a user wallet
async function createWallet(user){

    const userId = await userModel.findOne({username:user},{_id:1});

    let isWallet = await walletModel.findOne({userId:userId})

    if(!isWallet){

        const Balance = 0;

        const userWallet = await new walletModel({
            userId: userId,
            Balance: Balance
        })
        await userWallet.save();
        return "User wallet has been created.\nPlease top-up to continue placing bet";

    } else{
        return "Wallet already exists for you. Please continue placing bet"
    };
}


// ADD money to the user wallet
async function addMoney(data){

    const username = data.user;
    const amount = data.amount;

    // get userId from username
    const userid = await userModel.findOne({username:username},{_id:1,password:0});

    // Get current balance of the user
    const currentBalance = await walletModel.findOne({userId:userid},{_id:0,Balance:1});

    let updatedBalance = (currentBalance.Balance + amount);
    updatedBalance = toInteger(updatedBalance);


    // get the user wallet from the userID and update the balance after top-up
    const walletUpdate = await walletModel
        .findOneAndUpdate(
            {userId:userid},
            {Balance:updatedBalance},
            {new:true}
        ).select({Balance:1,_id:0})

        return await walletUpdate.Balance;
};

// Get the current balance of a user
async function getCurrentBalance(user){

    // get userId from username
    const userid = await userModel.findOne({username:user},{_id:1,password:0});

    const wallet = await walletModel.findOne({userId:userid},{_id:0,Balance:1});

    return wallet.Balance;
};

module.exports = {addMoney,getCurrentBalance,createWallet};
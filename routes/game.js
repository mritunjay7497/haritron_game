/*
This module handles the game logic and betting placed by the user.
* @params => {userId,numbers,amount}
*/

const express = require('express');
const bodyparser = require('body-parser');
const authorize = require('../middleware/authenticate');
const jsonparser = bodyparser.json();
const {luckyNumber} = require('../models/gameLogic');
const {getCurrentBalance,addMoney} = require('../models/wallet');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {toInteger} = require('lodash');

dotenv.config();
const secret = process.env.secret;

const game = express.Router();

let initialRound = 1
const roundLimit = Math.floor(Math.random()*(15-10+1)+10);


game.get('/',jsonparser,authorize,(req,res) => {

    /*
    This part gets two numbers, num1 & num2, from request body.
    It also needs the betting amount value from request body.
    */

    // Get username from JWT
    const token = req.header('x-auth-token');
    const payload = jwt.verify(token,secret);
    const user = payload.username;

    if(req.body.num1 !== 0 && req.body.num2 !== 0){
        const num1 = toInteger(req.body.num1);
        const num2 = toInteger(req.body.num2);
    } else{
        req.body.num1 = 0;
        req.body.num2 = null;
    }
    
    const betAmount = toInteger(req.body.bettingAmount);

    // Get the current balance of the user before placing bet

    async function balance(user){
        let walletBalance = await getCurrentBalance(user)
        return walletBalance;
    }
   
    async function gamePlay(betAmount,walletBalance){

        if(0<betAmount<=walletBalance){

            let number = 0;
            
            // Return ZERO after every 10-15 round 
            if (initialRound<roundLimit) {
    
                // Get the number selected by the system    
                const number = await luckyNumber();
                console.log("lucky number is",number)
                console.log("initialRound,RoundLimit",initialRound,roundLimit)
    
    
                // Check if the number selcted by the system belongs to any of the number selected by user
                // If the number is in the first place,add 50% extra of the bet value
    
                if(req.body.num1 === number.num1 || req.body.num2 === number.num1){
    
                    const amount = betAmount/2;         // Adding 50% of bet amount
                    const updateWalletBalance =   addMoney({user,amount});
                    initialRound+=1;
    
                } else if(req.body.num1 === number.num2 || req.body.num2 === number.num2){
    
                    const amount = betAmount*0.3;       // Adding 30% of bet value
                    const updateWalletBalance =   addMoney({user,amount});
                    initialRound+=1;
    
                } else if(req.body.num1 !== number.num1 && req.body.num1 !== number.num1 && req.body.num2 !== number.num1 && req.body.num2 !== number.num2){
                    const amount = betAmount*0.1        // Adding 10% of the bet value
                    const updateWalletBalance =  addMoney({user,amount})
                    initialRound+=1;
                }
                
            } else {
                number = 0;
                if(req.body.num1 === number){
                    const amount = betAmount*0.6        // Adding 60% of the bet value if user selects Zero
                    const updateWalletBalance =   addMoney({user,amount})
                    initialRound = 1;                   // reset the round
                }else{
                    const amount = 0;
                    const updateWalletBalance =  addMoney({user,amount});      // Add 0 if user selects 0 and it's not there
                    initialRound = 1;
                }
            }
    
            // Get updated wallet balance after every round
            async function updatedBalance(){
                return await getCurrentBalance(user)
            };
            return(updatedBalance());
    
        } else {
            return("Insufficient amount in the wallet.\nPlease top-up your wallet to continue placing bet")
        }

    }


    const walletBalance = balance(user)
        .then((amount) => {
            const game = gamePlay(betAmount,amount)
                .then((data) => console.log("data is:", data))
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    


    
});

module.exports = game;
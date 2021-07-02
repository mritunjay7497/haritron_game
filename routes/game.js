/*
This module handles the game logic and betting placed by the user.
* @params => {userId,numbers,amount}
*/

const express = require('express');
const bodyparser = require('body-parser');
const authorize = require('../middleware/authenticate');
const jsonparser = bodyparser.json();
const luckyNumber = require('../models/gameLogic');
const {getCurrentBalance,addMoney} = require('../models/wallet');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {toInteger} = require('lodash');

dotenv.config();
const secret = process.env.secret;

const game = express.Router();

// let initialRound = 1
// const roundLimit = Math.floor(Math.random()*(15-10+1)+10);

game.get('/',jsonparser,authorize,(req,res) => {

    /*
    This part gets two numbers, num1 & num2, from request body.
    It also needs the betting amount value from request body.
   */

    // Get user name from JWT
    const token = req.header('x-auth-token');
    const payload = jwt.verify(token,secret);
    const user = payload.username;

    let currentBalance = 0;
    let systemNumber = luckyNumber();

    // Check if both numbers supplied by the user are non-zero and lie b/w 1-9
    
    let firstUserNumber = req.body.num1;
    let secondUserNumber = req.body.num2;
    let betAmount = req.body.bettingAmount;
    let firstLuckyNumber = systemNumber.num1;
    let secondLuckyNumber = systemNumber.num2;
    let awardAmount = 0;

    if(0<firstUserNumber<=9 && 0<secondUserNumber<=9){

        // conver numbers entered by user to an integer
        firstUserNumber = toInteger(firstUserNumber);
        secondUserNumber = toInteger(secondUserNumber);

        // convert bet amount to integer
        betAmount = toInteger(betAmount);
        

        // Get current balance of user before placing bet
        getCurrentBalance(user)

            .then((balance) => currentBalance = balance)

            .then(() => {
                // aloow betting if current balance is more than or equal to the betting amount
                if(currentBalance>=betAmount){
                    // Betting award logic
                    // if either of the number selected by user ends up in the first place as the number selected by the system

                    if(firstUserNumber === firstLuckyNumber || secondUserNumber === firstLuckyNumber){
                        return awardAmount = betAmount/2   // award is 50% of bet amount
                    }

                    else if(firstUserNumber === secondLuckyNumber || secondUserNumber === secondLuckyNumber){
                        return awardAmount = (betAmount)*(0.3);    // award is 30% of the bet amount
                    } 

                    else if(firstUserNumber !== firstLuckyNumber && firstUserNumber !== secondLuckyNumber && secondUserNumber !== firstLuckyNumber && secondUserNumber !== secondUserNumber){
                        return awardAmount = (betAmount)*(0.1);    // award is 10% of the bet amount
                    } 
                    
                    else if(firstUserNumber === 0 || secondUserNumber === 0){
                        firstUserNumber = 0;
                        secondUserNumber = null;

                        if(firstUserNumber === firstLuckyNumber || firstUserNumber === secondLuckyNumber){
                            return awardAmount = (betAmount)*0.6   // award is 60% of the bet amount
                        }
                    } else {
                        return awardAmount = (betAmount)*(-1)
                    }
                } 
                else {
                    return 
                }
            })

            .then((amount) => addMoney({user,amount}))
            .then((balance) => {
                if(balance>0){
                    res.send(`The updated wallet balance is ${balance}`)
                } else{
                    res.send("insufficient balance in the wallet. Please top-up yout wallet to continue placing bet.")
                }
            })
            .catch((err) => console.log(err));

    }


});

module.exports = game;
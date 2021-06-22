/*
This is a protected route, which is to be consumed by the user after they login.
It adds the amount from the denomination hard-coded into their wallet to place the bet
* Denomination = [10,50,100,250,500]
*/

const authorize = require('../middleware/authenticate');
const express = require('express');
const jsonparser = require('body-parser').json();
const {addMoney,getCurrentBalance,createWallet} = require('../models/wallet')

const walletRoute = express.Router();

const denomination = [10,50,100,250,500];

/*
A user can ADD money to the wallet and WITHDRAW it as well.
The amount added to the wallet should be from the denominations objects
*/

// Create a user wallet
walletRoute.post('/create',jsonparser,authorize,(req,res) => {
    const userWallet = createWallet(req.body)
        .then((data) => res.send(data))
        .catch((err) => console.log(err))
})


// Get current balance
walletRoute.get('/',jsonparser,authorize,(req,res) => {

    const currentBalance = getCurrentBalance(req.body)
        .then((data) => res.send(`Current wallet balance is ${data} rs.`))
        .catch((err) => console.log(err));
    
});

// Add money into the wallet
walletRoute.post('/',jsonparser,authorize,(req,res) => {

    if(denomination.includes(req.body.amount)){

        const updatedBalance = addMoney(req.body)
        .then((data) => res.send(`The updated wallet balance is ${data} rs.`))
        .catch((err) => console.log(err));
    } else{
        res.status(403).send(`Please select a valid amount from the denominations\nDenominations = ${denomination}`)
    }
});

module.exports = walletRoute;
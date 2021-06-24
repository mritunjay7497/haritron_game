
// This function always return a number between 1 and 9 (both included)
async function luckyNumber(){

    let num1 = Math.floor(Math.random() * (9 - 1 + 1) ) + 1;
    let num2 = Math.floor(Math.random() * (9 - 1 + 1) ) + 1;

    return {num1,num2};
};


module.exports = {luckyNumber};
const crypto = require("crypto");

class Transaction {
  constructor(amount, payer, payee) {
    this.amount = amount;
    this.payer = payer;
    this.payee = payee;
    console.log("kitu");
  }

  toString = () => {
    return JSON.stringify(this);
  };
}

const transaction = new Transaction();

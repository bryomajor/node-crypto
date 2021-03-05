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

// const transaction = new Transaction();

class Block {
  constructor(prevHash, transaction) {
    this.prevHash = prevHash;
    this.transaction = transaction;
    this.timeStamp = new Date.now();
  }

  getHash = () => {
      const str = JSON.stringify(this);
      const hash = crypto.createHash('SHA256');
      hash.update(str).end();
      return hash.digest('hex');
  }
}


class Chain {
    static instance = new Chain();
    chain = []

    constructor() {
        this.chain = [new Block(null, new Transaction(100, 'odigenasis', 'protas'))];
    }

    getLastBlock = () => {
        return this.chain[this.chain.length - 1];
    }

    addBlock = (transaction, sendPublicKey, signature) => {
        const newBlock = new Block(this.lastBlock.hash, transaction);
        this.chain.push(newBlock);
    }
}
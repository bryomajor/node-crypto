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
    nonce = Math.round(Math.random() * 999999999);

  constructor(prevHash, transaction) {
    this.prevHash = prevHash;
    this.transaction = transaction;
    this.timeStamp = Date.now();
  }

  getHash = () => {
    const str = JSON.stringify(this);
    const hash = crypto.createHash("SHA256");
    hash.update(str).end();
    return hash.digest("hex");
  };
}

class Chain {
  static instance = new Chain();
  chain = [];

  constructor() {
    this.chain = [
      new Block(null, new Transaction(100, "odigenasis", "protas", "brian", "allen")),
    ];
  }

  getLastBlock = () => {
    return this.chain[this.chain.length - 1];
  };

  mine = (nonce) => {
      let solution = 1;
      console.log('Mining...');

      while(true) {

        const hash = crypto.createHash('MD5');
        hash.update((nonce + solution).toString()).end();

        const attempt = hash.digest('hex');

        if (attempt.substr(0, 4) === '0000') {
            console.log(`Solved: ${solution}`);
            return solution;
        }

        solution += 1;
      }
  }

  addBlock = (transaction, senderPublicKey, signature) => {
      const verifier = crypto.createVerify('SHA256');
      verifier.update(transaction.toString());

      const isValid = verifier.verify(senderPublicKey, signature);

      if (isValid) {
        const newBlock = new Block(this.getLastBlock().getHash(), transaction);
        this.mine(newBlock.nonce);
        this.chain.push(newBlock);
      }
  };
}

class Wallet {
  publicKey;
  privateKey;

  constructor() {
    const keypair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney = (amount, payeePublicKey) => {
      const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

      const sign = crypto.createSign('SHA256');
      sign.update(transaction.toString()).end();

      const signature = sign.sign(this.privateKey);
      Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

const odigenasis = new Wallet();
const protas = new Wallet();
const brian = new Wallet();
const allen = new Wallet();

odigenasis.sendMoney(50, protas.publicKey);
brian.sendMoney(300000, allen.publicKey);
allen.sendMoney(7000, odigenasis.publicKey);
brian.sendMoney(3000, protas.publicKey);
protas.sendMoney(400, odigenasis.publicKey);

console.log("😎",Chain.instance);
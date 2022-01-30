const SHA256 = require("crypto-js/sha256");

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.transactions = [];
    this.nonce = 0;
    this.previousHash = null;
    this.hash = null;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  addTransaction(transaction) {
    if (Array.isArray(transaction)) {
      transaction.forEach((tx) => {
        this.transactions.push(tx);
      });
    } else {
      this.transactions.push(transaction);
    }
  }

  execute() {
    this.transactions.forEach((x) => {
      if (x && typeof x.execute === "function") x.execute();
    });
  }
}

module.exports = Block;

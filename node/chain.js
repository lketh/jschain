const Blockchain = require("./models/blockchain.js");

const chain = {
  blockchain: new Blockchain(),
};

module.exports = chain;

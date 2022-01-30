const jayson = require("jayson");
const { startMining, stopMining } = require("./mine");
const { PORT } = require("./config");
const { blockchain } = require("./chain");
const Transaction = require("./models/transaction");
const UTXO = require("./models/utxo");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const SHA256 = require("crypto-js/sha256");

function getBalance(address) {
  const ourUTXOs = blockchain.utxos.filter((x) => {
    return x.owner === address && !x.spent;
  });

  const ourSpentUTXOs = blockchain.utxos.filter((x) => {
    return x.owner === address && x.spent;
  });
  const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
  const take = ourSpentUTXOs.reduce((p, c) => p + c.amount, 0);
  const result = sum - take;

  return result;
}

const server = jayson.server({
  startMining: function (_, callback) {
    callback(null, "success!");
    startMining();
  },
  stopMining: function (_, callback) {
    callback(null, "success!");
    stopMining();
  },
  getBalance: function ([address], callback) {
    const sum = getBalance(address);
    callback(null, sum);
  },
  sendTx: function ([sender, recipient, amount, signature], callback) {
    const messageHash = SHA256(
      JSON.stringify([sender, recipient, amount])
    ).toString();
    const key = ec.keyFromPublic(sender, "hex");

    const validSignature = key.verify(messageHash, signature);

    const senderBalance = getBalance(sender);
    if (senderBalance >= amount && validSignature) {
      const senderUTXO = new UTXO(sender, amount);
      const recipientUTXO = new UTXO(recipient, amount);
      const tx = new Transaction([senderUTXO], [recipientUTXO]);

      blockchain.addTransaction(tx);
    }

    callback(null, "Transaction Sent");
  },
});

server.http().listen(PORT);

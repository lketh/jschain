const client = require("./client");
const { argv } = require("yargs");
const { sender, recipient, amount } = argv;
const { PUBLIC_KEY, PRIVATE_KEY } = require("../node/config");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const SHA256 = require("crypto-js/sha256");

const privKeyIndex = PUBLIC_KEY.indexOf(sender);
const key = ec.keyFromPrivate(PRIVATE_KEY[privKeyIndex]);

const signature = key.sign(
  SHA256(JSON.stringify([sender, recipient, amount])).toString()
);

client.request(
  "sendTx",
  [sender, recipient, amount, signature],
  function (err, response) {
    if (err) throw err;
    console.log(response.result);
  }
);

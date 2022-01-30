const Block = require("./models/block");
const Transaction = require("./models/transaction");
const UTXO = require("./models/utxo");
const chain = require("./chain");
const { PUBLIC_KEY } = require("./config");
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;

let mining = true;
async function startUp() {
  await chain.blockchain.loadBlockchain();
  PUBLIC_KEY.forEach((_, index) => {
    mine(index);
  });
}

startUp();

function startMining() {
  mining = true;
  PUBLIC_KEY.forEach((_, index) => {
    mine(index);
  });
}

function stopMining() {
  mining = false;
}

function mine(node_id) {
  if (!mining) return;

  const block = new Block();

  const coinbaseUTXO = new UTXO(PUBLIC_KEY[node_id], BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  const pendingTXs = chain.blockchain.getPendingTransactions();
  block.addTransaction(pendingTXs);

  while (BigInt("0x" + block.calculateHash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }

  block.execute();

  block.hash = "0x" + block.calculateHash();

  chain.blockchain.addBlock(block);

  console.log(
    `Mined block #${chain.blockchain.getBlockHeight()} with a hash of ${block.calculateHash()} at nonce ${
      block.nonce
    } on miner ${node_id}`
  );

  if (chain.blockchain.isChainValid()) chain.blockchain.saveBlockchain();

  setTimeout(mine, Math.floor(Math.random() * 1000) + 7500, node_id);
}

module.exports = {
  startMining,
  stopMining,
};

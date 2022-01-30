var fs = require("fs");

class Blockchain {
  constructor() {
    this.blocks = [];
    this.mempool = [];
    this.utxos = [];
  }

  getLatestBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  getBlock(index) {
    return this.blocks[index];
  }

  getBlockHeight() {
    return this.blocks.length;
  }

  addBlock(block) {
    if (this.blocks.length === 0) {
      block.previousHash = "GENESIS";
    } else {
      if (this.getLatestBlock() !== undefined) {
        try {
          block.previousHash = this.getLatestBlock().hash;
        } catch (e) {}
      }
    }
    this.blocks.push(block);
  }

  getPendingTransactions() {
    return this.mempool.splice(0, 5);
  }

  addTransaction(transaction) {
    this.mempool.push(transaction);
  }

  isChainValid() {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      try {
        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      } catch (e) {}
    }
    return true;
  }

  saveBlockchain() {
    fs.writeFileSync("./blockchain.json", JSON.stringify(this.blocks));
    fs.writeFileSync("./utxos.json", JSON.stringify(this.utxos));
    fs.writeFileSync("./mempool.json", JSON.stringify(this.mempool));
  }

  async loadBlockchain() {
    try {
      if (fs.existsSync("./blockchain.json")) {
        console.log("Loading chain from file...");
        const blockchain = JSON.parse(
          await fs.readFileSync("./blockchain.json")
        );
        this.blocks = blockchain;
      }

      if (fs.existsSync("./utxos.json")) {
        console.log("Loading utxos from file...");
        const utxos = JSON.parse(await fs.readFileSync("./utxos.json"));
        this.utxos = utxos;
      }

      if (fs.existsSync("./mempool.json")) {
        console.log("Loading mempool from file...");
        const mempool = JSON.parse(await fs.readFileSync("./mempool.json"));
        this.mempool = mempool;
      }
    } catch (err) {
      console.log("Starting fresh");
      this.blocks = [];
    }
  }
}

module.exports = Blockchain;

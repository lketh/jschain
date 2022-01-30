const { blockchain } = require("../chain");

class Transaction {
  constructor(inputs, outputs) {
    this.inputs = inputs;
    this.outputs = outputs;
  }

  execute() {
    this.inputs.forEach((input) => {
      input.spent = true;
      blockchain.utxos.push(input);
    });

    this.outputs.forEach((output) => {
      blockchain.utxos.push(output);
    });
  }
}

module.exports = Transaction;

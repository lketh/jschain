# JSChain

## This was done using

`node 16.11.0` and `npm 8.0.0`

## Installation

Go into client and node and run `npm install`

## What changed?

- Added support for a mempool and tx processing.
- Added support for a simulated group of miners aka nodes.
- Updated the getBalance method to show the right balance if anything was spent.
- Persisted the chain, utxos and the mempool as json files.
- Faulty transactions and blocks are simply ignored.

## Demo

### Spin up the rpc server aka as the node which emulates 3 miners

```
❯ node rpc.js
Loading chain from file...
Loading utxos from file...
Loading mempool from file...
Mined block #2357 with a hash of 91c36122852c87158e859ded2f7f104c1efb19e3d8ddb31677f4282f2c904ea4 at nonce 39 on miner 0
Mined block #2358 with a hash of 0a68847e8653567e7d381c08fdcb4b3221aa047fb31c19af9ca3d733fceea4a1 at nonce 37 on miner 1
Mined block #2359 with a hash of b1eb9c9788908f6dc2537feda8ae0893819cdd9a2e12107fd55fe6d80b125d44 at nonce 20 on miner 2
```

### Check balances:

```
❯ node client/getBalance.js --address 041de3cb5061ad44e1c51860f04ec24c345b03cf7163cb3087827bc83b32fd247229c2e59bc3c7a1b54e33d396e406040d99847edcf642be6200eca4ac2208bbc6
15910
❯ node client/getBalance.js --address 04eb36b99c309fa864c8c990121b8fcfce74ccaac952797aac6a246a7105881dd1c15a1c0db870bda4583758637f3eaa5c87d9cb466d20c8c8556df2af588a5397
1070
```

### Send a TX and wait a second for it to be mined:

```
❯ node client/sendTx.js --sender 04eb36b99c309fa864c8c990121b8fcfce74ccaac952797aac6a246a7105881dd1c15a1c0db870bda4583758637f3eaa5c87d9cb466d20c8c8556df2af588a5397 --recipient 041de3cb5061ad44e1c51860f04ec24c345b03cf7163cb3087827bc83b32fd247229c2e59bc3c7a1b54e33d396e406040d99847edcf642be6200eca4ac2208bbc6 --amount 1000
Transaction Sent

❯ node client/getBalance.js --address 04eb36b99c309fa864c8c990121b8fcfce74ccaac952797aac6a246a7105881dd1c15a1c0db870bda4583758637f3eaa5c87d9cb466d20c8c8556df2af588a5397
140

❯ node client/getBalance.js --address 041de3cb5061ad44e1c51860f04ec24c345b03cf7163cb3087827bc83b32fd247229c2e59bc3c7a1b54e33d396e406040d99847edcf642be6200eca4ac2208bbc6
16980
```

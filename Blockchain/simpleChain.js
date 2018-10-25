/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');
const DL = require('./levelSandbox.js');
const Block = require('./simpleBlock.js');


/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/


class Blockchain {
    constructor() {

        DL.getBlockHeight().then((height) => {
            if (height == -1) {
                console.log("Genesis");
                let newBlock = new Block("First block in the chain - Genesis block");
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                DL.addDataToBlockchain(newBlock);
            }
        });
    }



    async getBlockHeight() {
        return new Promise((resolve, reject) => {
            DL.getBlockHeight().then((value) => {
                resolve(value);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    async getBlock(heigth) {
        return new Promise((resolve, reject) => {
            DL.getBlock(heigth).then((value) => {
                let block = JSON.parse(value);
                //console.log(block);
                resolve(block);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // Add new block
    addBlock(newBlock) {
        return new Promise((resolve, reject) => {
            DL.getBlockHeight().then((height) => {
                // Block height
                newBlock.height = height + 1;
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                // previous block hash
                if (newBlock.height > -1) {
                    DL.getBlock(height).then((value) => {
                        let preBlock = JSON.parse(value);
                        newBlock.previousBlockHash = preBlock.hash;
                        // Block hash with SHA256 using newBlock and converting to a string
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        // Adding block object to chain
                        DL.addDataToBlockchain(newBlock);
                        resolve(newBlock);
                    }).catch((err) => {
                        console.log(err);
                        reject(err);
                    });
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });;
        });
    }

    // validate block
    validateBlock(blockHeight) {
        return new Promise((resolve, reject) => {
            DL.getBlock(blockHeight).then((value) => {
                let block = JSON.parse(value);
                let blockHash = block.hash;
                block.hash = '';
                let validBlockHash = SHA256(JSON.stringify(block)).toString();
                if (blockHash === validBlockHash) {
                    resolve(true);
                } else {
                    console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
                    resolve(false);
                }
            }).catch((err) => {
                console.log("Error in getBlock at ValidateBlock() " + err);
                reject(err);
            });
        });
    }
    validateBlockInChain(blockHeight) {
        return new Promise((resolve, reject) => {
            DL.getBlockHeight().then((chainHeight) => {
                this.validateBlock(blockHeight).then((result) => {
                    console.log(result);
                    if (!result) {
                        resolve(1);
                    } else {
                        if (chainHeight != blockHeight) {
                            DL.getBlock(blockHeight).then((value) => {
                                let blockValue = JSON.parse(value);
                                let blockHash = blockValue.hash;
                                DL.getBlock(blockHeight + 1).then((valueNext) => {
                                    let valueNextValue = JSON.parse(valueNext);
                                    let previousHash = valueNextValue.previousBlockHash;

                                    console.log(blockHash + "  " + previousHash);
                                    if (blockHash !== previousHash) {
                                        console.log(1);
                                        resolve(1);
                                    } else {
                                        console.log(0);
                                        resolve(0);
                                    }
                                }).catch((err) => {
                                    console.log("Error in getNextBlock " + err);
                                    reject(err);
                                });
                            }).catch((err) => {
                                console.log("Error in getBlock " + err);
                                reject(err);
                            });
                        };
                    }
                }).catch((err) => {
                    console.log("Error validating block:" + err);
                    reject(err);
                });
            }).catch((err) => {
                console.log("Error block heigth:" + err);
                reject(err);
            });
        })
    }

    // Validate blockchain
    validateChain() {
        return new Promise((resolve, reject) => {
            DL.getBlockHeight().then((chainHeight) => {
                var promiseArray = [];
                for (let i = 0; i <= chainHeight; i++) {
                    // validate block
                    promiseArray.push(this.validateBlockInChain(i));
                }
                Promise.all(promiseArray).then((values) => {
                    var errBlockTotalNumber = 0;
                    var errBlocks = [];
                    for (var i = 0; i < values.length; i++) {
                        console.log(values);
                        if (values[i] === 1) {
                            errBlocks.push(i);
                            errBlockTotalNumber++;
                        }
                    }
                    //let errBlockNumber=values.reduce((a, b) => a + b, 0);
                    if (errBlockTotalNumber > 0) {
                        console.log('Block errors = ' + errBlockTotalNumber);
                        console.log('Err Blocks:' + errBlocks);
                        resolve('Block errors = ' + errBlockTotalNumber);
                    } else {
                        console.log('No errors detected');
                        resolve('No errors detected');
                    }
                }).catch((reason) => {
                    console.log("reason");
                    console.log(reason);
                    reject(reason);
                });
            }).catch((err) => {
                console.log("err");
                console.log(err);
                reject(err);
            });
        })
    }
}

module.exports = Blockchain;

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

// Blocks
// (function theLoop(i) {
//     let blockchain = new Blockchain();
//     setTimeout(function () {
//         let blockTest = new Block("Test Block - " + (i + 1));
//         blockchain.addBlock(blockTest).then((result) => {
//             console.log(result);
//             i++;
//             if (i < 10) theLoop(i);
//         });
//     }, 100);
// })(0);

/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// Add data to levelDB with key/value pair
function addLevelDBData(key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, JSON.stringify(value), function (err) {
      console.log(value);
      if (err) reject(err);
    })
  });
}

 exports.addLevelDBData =function(key, value) {
  return new Promise((resolve, reject) => {
    db.put(key, JSON.stringify(value), function (err) {
      console.log(value);
      if (err) reject(err);
    })
  });
}


// Get data from levelDB with key
exports.getBlock = function (blockHeight) {
  return new Promise((resolve, reject) => {
    db.get(blockHeight, function (err, value) {
      if (err) return console.log('Not found!', err);
      resolve(JSON.parse(JSON.stringify(value)));
    })
  });
}


// Get block height
exports.getBlockHeight = function () {
  return new Promise((resolve, reject) => {
    let i = 0;
    db.createReadStream().on('data', function (data) {
      i++;
    }).on('error', function (err) {
      console.log('Unable to read data stream!', err);
      reject(err);
    }).on('close', function () {
      resolve(i - 1);
    });
  });

}

// Add data to levelDB with value
exports.addDataToBlockchain = function (Block) {
  return new Promise((resolve, reject) => {
    let i = 0;
    db.createReadStream().on('data', function (data) {
      i++;
    }).on('error', function (err) {
      console.log('Unable to read data stream!', err);
      reject(err);
    }).on('close', function () {
      console.log('Block #' + i);
      addLevelDBData(i, Block);
    });
  });
}



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


// (function theLoop(i) {
//   setTimeout(function () {
//     addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);

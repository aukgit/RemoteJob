const fs = require('fs');
const path = require('path');
const moment = require('moment');
const crypto = require('crypto');
const lzma = require('lzma-native');

let getSecret = function () {
  let secret = "This is a secret key";
  return secret;
}

let compressDB = function () {
  let compressor = lzma.createCompressor(),
      fileInitial = moment().format('DDMMYY_hhmm'),
      input = fs.createReadStream(path.join(__dirname,'../../db/data.db')),
      output = fs.createWriteStream(path.join(__dirname,'../../db/'+fileInitial+'_data.db.xz')),
      encrypt = crypto.createCipher("aes-256-ctr",getSecret());
      input.pipe(compressor).pipe(encrypt).pipe(output);
}

let contineouslySendDatabase = function (delay) {
  function send() {
    sendDatabase();
    setTimeout(send, delay);
  }
  send();
}

let sendDatabase = function () {
  console.log('DB processing..');
  compressDB();
  console.log("Data sent.");
}

module.exports = {
  sendDatabase: sendDatabase,
  contineouslySendDatabase: contineouslySendDatabase
}

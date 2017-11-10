const fs = require('fs');
const path = require('path');
const moment = require('moment');
const crypto = require('crypto');
const lzma = require('lzma-native');
const mn = 60000;

let getSecret = function () {
  let secret = "This is a secret key";
  return secret;
}

let compressDB = function () {
  let compressor = lzma.createCompressor(),
      fileInitial = moment().format('DDMMYY_hhmm'),
      input = fs.createReadStream(path.join(__dirname,'../../db/data.db')),
      output = fs.createWriteStream(path.join(__dirname,'../../db/'+fileInitial+'_data.db.xz')),
      encrypt = crypto.createCipher("aes-256-ctr", getSecret());
      input.pipe(compressor).pipe(encrypt).pipe(output);
      console.log("Data sent.");
}

let contineouslySendDatabase = function (delay) {
  function send() {
    sendDatabase();
    setTimeout(send, delay*mn);
  }
  send();
}

let sendDatabase = function (delay) {
  console.log('DB processing..');
  setTimeout(compressDB, delay*mn);
}

module.exports = {
  sendDatabase: sendDatabase,
  contineouslySendDatabase: contineouslySendDatabase
}

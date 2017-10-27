const fs = require('fs');
const lzma = require('lzma-native');
const path = require('path');
const moment = require('moment');

let compressDB = function () {
  let compressor = lzma.createCompressor(),
      fileInitial = moment().format('DDMMYY_hhmm'),
      input = fs.createReadStream(path.join(__dirname,'../../db/data.db')),
      output = fs.createWriteStream(path.join(__dirname,'../../db/'+fileInitial+'_data.db.xz'));
      input.pipe(compressor).pipe(output);
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

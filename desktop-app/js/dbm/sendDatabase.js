const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const moment = require('moment');
const crypto = require('crypto');
const zipdir = require('zip-dir');
//const lzma = require('lzma-native');
const mailer = require(path.join(__dirname, '../mail/mailer'));
const mn = 60000;

let getSecret = function () {
  let secret = "This is a secret key";
  return secret;
}

let compressDB = function () {
  //compressor = lzma.createCompressor(),
  let fileInitial = moment().format('DDMMYY_hhmm'),
      input = path.join(uData,'/data/data.db'),
      output = path.join(uData,'/data/'+fileInitial+'_data.db.xz'),
      encrypt = crypto.createCipher("aes-256-ctr", getSecret());
      zipdir(input, { saveTo: output }, function (err, buffer) {
        if(buffer){
          let file = {
            path: path.join(uData,'/data/'+fileInitial+'_data.db.xz')
          },
          msg = {
            subject: "Sahahidul Islam Majumder - Data for " + moment().format('LTS'),
            description: "Data for last 5 Minutes"
          };
          mailer.sendData(msg, file);
        }
      });
}

let contineouslySendDatabase = function (delay) {
  function send() {
    sendDatabase();
    setTimeout(send, delay*mn);
  }
  setTimeout(send, delay*mn);
}

let sendDatabase = function (delay) {
  compressDB();
}

module.exports = {
  sendDatabase,
  contineouslySendDatabase
}

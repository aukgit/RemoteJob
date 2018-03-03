const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const moment = require('moment');
const crypto = require('crypto');
const zipdir = require('zip-dir');
const mailer = require(path.join(__dirname, '../mail/mailer'));
const minute = 60000;
let intervalFunction;

/**
 * Get secret key from the config file
 */

let getSecretKey = function (secretKey) {
  let secret = "This is a secret key";
  return secretKey;
}

/**
 * Compress database and generate message body for email
 */

let compressDB = function () {
  let fileInitial = moment().format('DDMMYY_hhmm'),
      input = path.join(uData,'/data/data.db'),
      output = path.join(uData,'/data/'+fileInitial+'_data.db.xz'),
      encrypt = crypto.createCipher("aes-256-ctr", getSecretKey());

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

let contineouslySendDatabase = function (delayTime) {
  setInterval(sendDatabase, delayTime*minute);
}

/**
 * comress the database before sending
 */

let sendDatabase = function (delayTime) {
  compressDB();
}

module.exports = {
  sendDatabase,
  contineouslySendDatabase
}

const fs = require('fs');
require('hazardous');
const path = require('path');
const zipdir = require('zip-dir');
const moment = require('moment');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const mailer = require(path.join(__dirname,'./mailer'));
const {db} = require(path.join(__dirname,'../dbm/initDB'));
const excel = require(path.join(__dirname,'../dbm/generateExcel'));
const imageGenerator = require(path.join(__dirname,'../screenshot/generateImageFromDB'));

let emailMessage = null;

/**
 * Copy database file in email package directory
 */

let copyDatabase = function copyDatabase() {
    fs.createReadStream(path.join(uData, '/data/data.db')).pipe(fs.createWriteStream(path.join(uData, '/data/dataPack/data.db')));
}

/**
 * this function compress the directory created with email data
 * send the compressed file path as attachment to mailer.js > sendData
 */

let compressDB = function () {
  let fileInitial = 'shahids_'+moment().format('DDMMYY_hhmm'),
      dir = path.join(uData, '/data/dataPack'),
      output = path.join(uData, '/data/emailData/'+fileInitial+'_data.zip');
      zipdir(dir, { saveTo: output }, function (err, buffer) {
        if(buffer){
          let file = {
            filename: fileInitial + '_data.zip',
            path: output
          };
          mailer.sendData(emailMessage, file);
        }
      });
}

/**
 * Organize data for email attachment (in dataPack folder)
 * 1. Generate Excel file
 * 2. Copy database
 * 3. Generate image and after that compress the directory
 */

let organizeData = function organizeData() {
  excel.generateExcelFile();
  copyDatabase();
  imageGenerator.generateImg(compressDB);
}

let packageData = function packageData(message) {
  emailMessage = message;
  organizeData();
}

module.exports = {
  packageData
}

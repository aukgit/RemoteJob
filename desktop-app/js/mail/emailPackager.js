const fs = require('fs');
const path = require('path');
const zipdir = require('zip-dir');
const moment = require('moment');
const lzma = require('lzma-native');
const mailer = require('./mailer');
const excel = require('../dbm/generateExcel');
const imager = require('../screenshot/generateImageFromDB');

let m = null;

let copyDatabase = function copyDatabase() {
  fs.createReadStream(path.join(__dirname,'../../db/data.db')).pipe(fs.createWriteStream(path.join(__dirname,'../../data/data.db')));
}

let compressDB = function () {
  let compressor = lzma.createCompressor(),
      fileInitial = 'username_'+moment().format('DDMMYY_hhmm'),
      dir = path.join(__dirname,'../../data'),
      output = path.join(__dirname,'../../'+fileInitial+'_data.zip');
      zipdir(dir, { saveTo: output }, function (err, buffer) {
        if(buffer){
          let file = {
            path: output
          };
          console.log("I'm at packager");
          mailer.sendData(m, file);
        }
      });
}

let senData = function sendData() {

}

let organizeData = function organizeData(msg) {
  excel.generateExcelFile();
  copyDatabase();
  imager.generateImg(compressDB);
}

let packageData = function packageData(msg) {
  m = msg;
  organizeData();
}

module.exports = {
  packageData
}

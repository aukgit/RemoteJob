const fs = require('fs');
const path = require('path');
const zipdir = require('zip-dir');
const moment = require('moment');
//const lzma = require('lzma-native');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const mailer = require(path.join(__dirname,'./mailer'));
const excel = require(path.join(__dirname,'../dbm/generateExcel'));
const imager = require(path.join(__dirname,'../screenshot/generateImageFromDB'));

let m = null;

let copyDatabase = function copyDatabase() {
  fs.createReadStream(path.join(uData + '/data/data.db')).pipe(fs.createWriteStream(path.join(uData + '/data/dataPack/data.db')));
}

let compressDB = function () {
  //compressor = lzma.createCompressor(),
  let fileInitial = 'shahids_'+moment().format('DDMMYY_hhmm'),
      dir = path.join(uData + '/data/dataPack'),
      output = path.join(uData + '/data/emailData/'+fileInitial+'_data.zip');
      zipdir(dir, { saveTo: output }, function (err, buffer) {
        if(buffer){
          let file = {
            filename: fileInitial + '_data.zip',
            path: output
          };
          console.log("I'm at packager");
          mailer.sendData(m, file);
        }
      });
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

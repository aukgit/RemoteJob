const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const json2xls = require('json2xls');
const processDbm = require(path.join(__dirname,'./processDbm'));

let dataToExcel = function (data) {
  if (data) {
    let xls = json2xls(data);
    let targetFile = path.join(uData, '/data/dataPack/data.xlsx');
    fs.writeFileSync(targetFile, xls, 'binary', (err) => {
      if(err){
        console.log("Error in excel");
      }
    });
  } else {
    console.log("No data!");
  }
}

let generateExcelFile = function () {
  processDbm.getAllActiveProcesses(dataToExcel);
}

module.exports = {
  generateExcelFile
}

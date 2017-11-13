const fs = require('fs');
const path = require('path');
const json2xls = require('json2xls');
const processDbm = require('./processDbm');

let dataToExcel = function (data) {
  let xls = json2xls(data);
  let targetFile = path.join(__dirname,'../../data/data.xlsx');
  fs.writeFileSync(targetFile, xls, 'binary');
}

let generateExcelFile = function () {
  processDbm.getAllActiveProcesses(dataToExcel);
}

module.exports = {
  generateExcelFile
}

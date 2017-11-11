const fs = require('fs');
const path = require('path');
const json2xls = require('json2xls');
const processDbm = require('./processDbm');

let printData = function (data) {
  let xls = json2xls(data);
  let targetFile = path.join(__dirname,'../../db/data.xlsx');
  fs.writeFileSync(targetFile, xls, 'binary');
}

let generateExcelFile = function () {
  processDbm.getAllActiveProcesses(printData);
}

module.exports = {
  generateExcelFile
}

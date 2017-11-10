const fs = require('fs');
const path = require('path');
const json2xls = require('json2xls');
const processDbm = require('./processDbm');

console.log(processDbm);

let printData = function (data) {
  let xls = json2xls(data);
  let targetFile = path.join(__dirname,'../../db/data.xlsx');
  console.log(targetFile.toString());
  fs.writeFileSync(targetFile, xls, 'binary');
}

let generateExcelFile = function () {
  console.log("Hello");
  processDbm.getAllActiveProcesses(printData);
}

module.exports = {
  generateExcelFile
}

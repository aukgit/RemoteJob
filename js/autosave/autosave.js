const jsonfile = require('jsonfile');
const moment = require('moment');
const path = require('path');
const file = path.join(__dirname, '../../tmp/data.json');

let saveData = function (p) {
  p.ended = moment().format('LTS');
  jsonfile.writeFile(file, p, function (err) {
    if(err){
      console.error(err);
    }
  });
}

let readSavedData = function () {
  jsonfile.readFile(file, function(err, obj) {
    console.dir(obj);
  });
}

module.exports = {
  saveData: saveData,
  readSavedData: readSavedData
};

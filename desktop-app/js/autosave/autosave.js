const jsonfile = require('jsonfile');
const moment = require('moment');
const path = require('path');
const file = path.join(__dirname, '../../tmp/data.json');
const timeDataPath = path.join(__dirname, '../../tmp/time.json');

let saveData = function savaDataAsJSON(p) {
  p.ended = moment().format('x');
  jsonfile.writeFile(file, p, function (err) {
    if(err){
      console.error(err);
    }
  });
}

let saveStartedTime = function saveTime(time) {
  jsonfile.writeFile(timeDataPath, time, function (err) {
    if(err){
      console.error(err);
    }
  });
}

let resetData = function resetDataFile() {
  jsonfile.writeFile(file, {}, function (err) {
    if(err){
      console.error(err);
    }
  });
}

let readSavedData = function readData(fn) {
  jsonfile.readFile(file, function(err, obj) {
    if (obj) {
      //console.log(obj);
      fn(obj);
    } else {
      //console.log("Empty");
    }
  });
}

let readStartedTime = function readStartedTime(fn) {
  jsonfile.readFile(timeDataPath, function(err, obj) {
    if (obj) {
      //console.log(obj);
      fn(obj);
    } else {
      //console.log("Empty");
    }
  });
}

module.exports = {
  saveData,
  saveStartedTime,
  resetData,
  readSavedData,
  readStartedTime
};

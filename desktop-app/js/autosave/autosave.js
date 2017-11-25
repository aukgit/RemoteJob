const jsonfile = require('jsonfile');
const moment = require('moment');
const path = require('path');
const {db} = require('../dbm/initDB');
const file = path.join(__dirname, '../../tmp/data.json');
const timeDataPath = path.join(__dirname, '../../tmp/time.json');

let saveData = function savaDataAsJSON(p) {
  if (p) {
    p.ended = moment().format('x');
    let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
    stmt.run('Process', JSON.stringify(p) , moment().format('x'));
  }
}

let saveStartedTime = function saveTime(time) {
  jsonfile.writeFile(timeDataPath, time, function (err) {
    if(err){
      console.error(err);
    }
  });
}

let resetData = function resetDataFile() {
  let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
  stmt.run('Process', JSON.stringify({}) , moment().format('x'));
}

let readSavedData = function readData(fn) {
  db.serialize(() => {
    db.all('SELECT Data from Temp WHERE Title = "Process"', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        fn(JSON.parse(res[0].Data));
      }
    });
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

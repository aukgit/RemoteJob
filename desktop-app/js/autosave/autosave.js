const moment = require('moment');
const path = require('path');
const { db } = require(path.join(__dirname, '../dbm/initDB'));

let saveData = function savaTempData(processInfo) {
  if (processInfo) {
    processInfo.ended = moment().format('x');
    let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
    stmt.run('Process', JSON.stringify(processInfo), moment().format('x'));
  }
}

let readSavedData = function readData(callback, processInfo) {
  if (processInfo) {
    db.serialize(() => {
      db.all('SELECT Data from Temp WHERE Title = "Process"', (err, res) => {
        if (err) {
          console.log(err);
        } else {
          callback(JSON.parse(res[0].Data));
        }
      });
    });
  }
}

let resetData = function resetDataFile() {
  let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
  stmt.run('Process', JSON.stringify({}), moment().format('x'));
}

let saveStartedTime = function saveTime(time) {
  if (time) {
    let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
    stmt.run('StartedTime', time.toString(), moment().format('x'));
  }
}

let readStartedTime = function readStartedTime(callback) {
  db.serialize(() => {
    db.all('SELECT Data from Temp WHERE Title = "StartedTime"', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        if (res) {
          if (res[0]) {
            callback(res[0].Data);
          } else {
            console.log("No data!");
            callback(0);
          }
        }
      }
    });
  });
}


let saveTotalWorkingTime = function saveWorkingTime(time) {
  if (time) {
    let stmt = db.prepare("REPLACE INTO Temp (Title, Data, CreatedAt) VALUES (?,?,?)");
    stmt.run('TotalWorkingTime', time.toString(), moment().format('x'));
  }
}

let readTotalWorkingTime = function readWorkingTime(callback) {
  db.serialize(() => {
    db.all('SELECT Data from Temp WHERE Title = "TotalWorkingTime"', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        if (res) {
          if (res[0]) {
            callback(Number(res[0].Data));
          } else {
            console.log("No Data!");
            callback(0);
          }
        }
      }
    });
  });
}

module.exports = {
  saveData,
  saveStartedTime,
  saveTotalWorkingTime,
  resetData,
  readSavedData,
  readStartedTime,
  readTotalWorkingTime
};

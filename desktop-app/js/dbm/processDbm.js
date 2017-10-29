const {db} = require('./initDB');

let createProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS Processes (id INTEGER PRIMARY KEY, PID INTEGER, Title TEXT UNIQUE)");
}

let createActiveProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS ActiveProcesses (id INTEGER PRIMARY KEY, Process TEXT, Started TEXT, Closed TEXT, MousePosX INTEGER, MousePosY INTEGER, TotalMouseClick INTEGER, MouseBtn INTEGER, TotalKeyPress INTEGER, ScreenshotId INTEGER, SequenceOfStartingMinutes INTEGER, TotalActiveTime INTEGER, FOREIGN KEY (Process) REFERENCES Processes(id), FOREIGN KEY (ScreenshotId) REFERENCES Images(id))");
}

let addProcess = function (p) {
  let stmt = db.prepare("INSERT OR IGNORE INTO Processes (PID, Title) VALUES (?,?)");
  stmt.run(p.pid, p.title);
}

let getAllProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from Processes', (err, res) => {
      //console.log(res);
    });
  });
}

let addActiveProcess = function (p) {
  let m = p.mouseData, btn = parseInt(m.btn);
  //console.log(m);
  let stmt = db.prepare("INSERT INTO ActiveProcesses (Process, Started, Closed, MousePosX, MousePosY, TotalMouseClick, MouseBtn, TotalKeyPress, ScreenshotId, SequenceOfStartingMinutes, TotalActiveTime) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
  stmt.run(p.title, p.started, p.ended, m.xPos, m.yPos, m.totalClick, btn, m.totalKeypress, p.screenshotId,p.sequence,p.totalActiveTime);
}

let getAllActiveProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from ActiveProcesses', (err, res) => {
      //console.log(res);
    });
  });
}

let initTables = function () {
  createProcessTable();
  createActiveProcessTable();
}

initTables();

module.exports = {
  addProcess: addProcess,
  getAllProcesses: getAllProcesses,
  addActiveProcess: addActiveProcess,
  getAllActiveProcesses: getAllActiveProcesses
};
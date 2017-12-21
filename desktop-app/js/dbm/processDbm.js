const path = require('path');
const {db} = require(path.join(__dirname,'./initDB'));

let createProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS Processes (id INTEGER PRIMARY KEY, PID INTEGER, Title TEXT UNIQUE)");
}

let createMousePosTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS MousePos (id INTEGER PRIMARY KEY, MousePosX INTEGER, MousePosY INTEGER, BtnClicked INTEGER, ClickedAt INTEGER)");
}

let createActiveProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS ActiveProcesses (id INTEGER PRIMARY KEY, Process TEXT, Started INTEGER, Closed INTEGER, MousePosX INTEGER, MousePosY INTEGER, TotalMouseClick INTEGER, MouseBtn INTEGER, TotalKeyPress INTEGER, Intensity REAL, ScreenshotId INTEGER, SequenceOfStartingMinutes INTEGER, TotalActiveTime INTEGER, FOREIGN KEY (Process) REFERENCES Processes(id), FOREIGN KEY (ScreenshotId) REFERENCES Images(id))");
}

let createTempDataTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS Temp (Title TEXT PRIMARY KEY, Data TEXT, CreatedAt INTEGER)");
}

/**
 * Add new process to database
 */

let addProcess = function (processInfo) {
  let stmt = db.prepare("INSERT OR IGNORE INTO Processes (PID, Title) VALUES (?,?)");
  stmt.run(processInfo.pid, processInfo.title);
}

let addMousePos = function (mouseInfo) {
  let stmt = db.prepare("INSERT INTO MousePos (MousePosX, MousePosY, BtnClicked, ClickedAt) VALUES (?,?,?,?)");
  stmt.run(mouseInfo.xPos, mouseInfo.yPos, mouseInfo.btn, mouseInfo.clickedAt);
}

let getAllProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from Processes', (err, res) => {
      //Process name and ID
    });
  });
}

let addActiveProcess = function (processInfo) {
  let mouseInfo = processInfo.mouseData, btnClicked = parseInt(mouseInfo.btn);
  let stmt = db.prepare("INSERT INTO ActiveProcesses (Process, Started, Closed, MousePosX, MousePosY, TotalMouseClick, MouseBtn, TotalKeyPress, Intensity, ScreenshotId, SequenceOfStartingMinutes, TotalActiveTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
  stmt.run(processInfo.title, processInfo.started, processInfo.ended, mouseInfo.xPos, mouseInfo.yPos, mouseInfo.totalClick, btnClicked, mouseInfo.totalKeypress, processInfo.intensity,  processInfo.screenshotId, processInfo.sequence, processInfo.totalActiveTime);
}

/**
 * get active process info as js object
 * send the response as argument in callback
 */

let getAllActiveProcesses = function (callback) {
  db.serialize(() => {
    db.all('SELECT id, Process as Application, datetime(Started/1000,"unixepoch","localtime") as Started, datetime(Closed/1000, "unixepoch","localtime") as Closed, MousePosX, MousePosY, TotalMouseClick, MouseBtn, TotalKeyPress, Intensity, ScreenshotId, SequenceOfStartingMinutes, TotalActiveTime  from ActiveProcesses', (err, res) => {
      callback(res);
    });
  });
}

/**
 * Create/Intialize DB tables if not exists
 */

let initTables = function () {
  createProcessTable();
  createTempDataTable();
  createMousePosTable();
  createActiveProcessTable();
}

initTables();

module.exports = {
  addProcess,
  addMousePos,
  getAllProcesses,
  addActiveProcess,
  getAllActiveProcesses
};

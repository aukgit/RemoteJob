const {db} = require('./initDB');

let createProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS Processes (id INTEGER PRIMARY KEY, PID INTEGER, Title TEXT UNIQUE)");
}

let createMousePosTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS MousePos (id INTEGER PRIMARY KEY, MousePosX INTEGER, MousePosY INTEGER, BtnClicked INTEGER, ClickedAt INTEGER)");
}

let createActiveProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS ActiveProcesses (id INTEGER PRIMARY KEY, Process TEXT, Started INTEGER, Closed INTEGER, MousePosX INTEGER, MousePosY INTEGER, TotalMouseClick INTEGER, MouseBtn INTEGER, TotalKeyPress INTEGER, Intensity REAL, ScreenshotId INTEGER, SequenceOfStartingMinutes INTEGER, TotalActiveTime INTEGER, FOREIGN KEY (Process) REFERENCES Processes(id), FOREIGN KEY (ScreenshotId) REFERENCES Images(id))");
}

let addProcess = function (p) {
  let stmt = db.prepare("INSERT OR IGNORE INTO Processes (PID, Title) VALUES (?,?)");
  stmt.run(p.pid, p.title);
}

let addMousePos = function (mouseInfo) {
  let stmt = db.prepare("INSERT INTO MousePos (MousePosX, MousePosY, BtnClicked, ClickedAt) VALUES (?,?,?,?)");
  stmt.run(mouseInfo.xPos, mouseInfo.yPos, mouseInfo.btn, mouseInfo.clickedAt);
}

let getAllProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from Processes', (err, res) => {

    });
  });
}

let addActiveProcess = function (p) {
  let m = p.mouseData, btn = parseInt(m.btn);
  //console.log(m);
  let stmt = db.prepare("INSERT INTO ActiveProcesses (Process, Started, Closed, MousePosX, MousePosY, TotalMouseClick, MouseBtn, TotalKeyPress, Intensity, ScreenshotId, SequenceOfStartingMinutes, TotalActiveTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
  stmt.run(p.title, p.started, p.ended, m.xPos, m.yPos, m.totalClick, btn, m.totalKeypress, p.intensity,  p.screenshotId, p.sequence, p.totalActiveTime);
}

let getAllActiveProcesses = function (fn) {
  db.serialize(() => {
    db.all('SELECT id, Process as Application, datetime(Started/1000,"unixepoch","localtime") as Started, datetime(Closed/1000, "unixepoch","localtime") as Closed, MousePosX, MousePosY, TotalMouseClick, MouseBtn, TotalKeyPress, Intensity, ScreenshotId, SequenceOfStartingMinutes, TotalActiveTime  from ActiveProcesses', (err, res) => {
      fn(res);
    });
  });
}

let initTables = function () {
  createProcessTable();
  createMousePosTable();
  createActiveProcessTable();
}

initTables();

module.exports = {
  addProcess: addProcess,
  addMousePos: addMousePos,
  getAllProcesses: getAllProcesses,
  addActiveProcess: addActiveProcess,
  getAllActiveProcesses: getAllActiveProcesses
};

const {db} = require('./initDB');

let createProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS processes (id INTEGER, pid INTEGER, title TEXT PRIMARY KEY)");
}

let createActiveProcessTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS activeprocesses (id INTEGER PRIMARY KEY, process TEXT, started TEXT, closed TEXT, screenshotId INTEGER, FOREIGN KEY (process) REFERENCES processes(id), FOREIGN KEY (screenshotId) REFERENCES images(id))");
}

let addProcess = function (p) {
  let stmt = db.prepare("INSERT OR IGNORE INTO processes (id, pid, title) VALUES ((SELECT IFNULL(MAX(id), 0) + 1 FROM processes),?,?)");
  stmt.run(p.pid, p.title);
}

let getAllProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from processes', (err, res) => {
      //console.log(res);
    });
  });
}

let addActiveProcess = function (p) {
  let stmt = db.prepare("INSERT INTO activeprocesses (process, started, closed, screenshotId) VALUES (?,?,?,?)");
  stmt.run(p.title, p.started, p.ended, p.screenshotId);
}

let getAllActiveProcesses = function () {
  db.serialize(() => {
    db.all('SELECT * from activeprocesses', (err, res) => {
      console.log(res);
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

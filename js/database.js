const path = require('path');
const dbPath = path.join(__dirname, '../db/todo.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

module.exports = {

  createTableForBlob: function () {
    db.run("CREATE TABLE IF NOT EXISTS images (ID INTEGER PRIMARY KEY, img BLOB)");
  },

  insertScreenshotBlob: function (sc) {
    let stmt = db.prepare("INSERT INTO images (img) VALUES (?)");
    stmt.run(sc);
  },

  getAllBlob: function () {
    db.serialize(() => {
      db.all('SELECT * from images', (err, res) => {
        console.log(res);
      });
    });
  },

  createTableForProcessTitle: function () {
    db.run("CREATE TABLE IF NOT EXISTS processlist (id INTEGER, pid INTEGER, title TEXT PRIMARY KEY)");
  },

  createTableForActiveProcessList: function () {
    db.run("CREATE TABLE IF NOT EXISTS activeprocesslist (id INTEGER PRIMARY KEY, pid INTEGER, process INTEGER, started TEXT, closed TEXT, FOREIGN KEY (process) REFERENCES processlist(id))");
  },

  insertProcessTitle: function (p) {
    let stmt = db.prepare("INSERT OR IGNORE INTO processlist (id, pid, title) VALUES ((SELECT IFNULL(MAX(id), 0) + 1 FROM processlist),?,?)");

    stmt.run(p.pid, p.title);
  },

  getAllProcesses: function () {
    db.serialize(() => {
      db.all('SELECT * from processlist', (err, res) => {
        console.log(res);
      });
    });
  },

  addNewProcess: function (newProcess) {
    db.serialize(() => {
      
    });
  },

  insertBlob: function (blob) {
    console.log(blob);
  }
}

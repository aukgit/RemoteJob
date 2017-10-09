const path = require('path');
const dbPath = path.join(__dirname, '../db/todo.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

module.exports = {

  createTableForBlob: function () {
    db.run("CREATE TABLE IF NOT EXISTS images (ID INTEGER PRIMARY KEY, img BLOB)");
  },

  createTableForProcessTitle: function () {
    db.run("CREATE TABLE IF NOT EXISTS processlist (ID INTEGER, title TEXT PRIMARY KEY)");
  },

  insertProcessTitle: function (p) {
    let stmt = db.prepare("INSERT OR IGNORE INTO processlist (id, title) VALUES (?,?)");
    stmt.run(p.pid, p.app);
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

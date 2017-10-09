const path = require('path');
const dbPath = path.join(__dirname, '../db/todo.db');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

module.exports = {
  getAllProcesses: function () {
    db.serialize(() => {
      db.all('SELECT * from lorem', (err, res) => {
        return res;
      });
    });
  },

  addNewProcess: function (newProcess) {
    db.serialize(() => {
      
    });
  }
}

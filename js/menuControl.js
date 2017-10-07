const remote = require('electron').remote;
const activeWin = require('active-win');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, './db/todo.db');
const db = new sqlite3.Database(dbPath);
const gkm = require('gkm');


function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  gkm.events.on('mouse.*', function(data) {
    //console.log(data);
    getActiveWindowProcessInfo();
  });

  db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

    // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    // for (var i = 0; i < 10; i++) {
    //     stmt.run("Ipsum " + i);
    // }
    // stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
        console.log(row.id + ": " + row.info);
    });
  });

  db.close();

}

let pid = 0;

function getActiveWindowProcessInfo() {
  activeWin().then(res => {
    //console.log(res);
  });
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
    //generateProcessList();
    getActiveWindowProcessInfo();
  }
};

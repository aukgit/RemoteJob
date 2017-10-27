const fs = require('fs');
const path = require('path');

let backUpDatabase = function (delay) {
  function createBackup() {
    fs.createReadStream(path.join(__dirname,'../../db/data.db')).pipe(fs.createWriteStream(path.join(__dirname,'../../db/backup_data.db')));
    //console.log("Hello");
    setTimeout(createBackup, delay);
  }
  createBackup();
}

module.exports = {
  backUpDatabase: backUpDatabase
}

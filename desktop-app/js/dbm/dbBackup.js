const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const mn = 60000;
let backUpDatabase = function (delay,play) {
  if (play) {
    function createBackup() {
      fs.createReadStream(path.join(uData,'/data/data.db')).pipe(fs.createWriteStream(path.join(uData,'/data/backup_data.db')));
      setTimeout(createBackup, delay*mn);
    }
    setTimeout(createBackup, delay*mn);
  }
}

module.exports = {
  backUpDatabase
}

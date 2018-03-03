const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const minute = 60000;
let intervalFunction;

/**
 * Create database backup with the interval defined by config
 */

let createBackup = function createBackup() {
    fs.createReadStream(path.join(uData,'/data/data.db')).pipe(fs.createWriteStream(path.join(uData,'/data/backup_data.db')));
}

let backUpDatabase = function (backUpDelay, isPlaying) {
  if (isPlaying) {
    intervalFunction = setInterval(createBackup, backUpDelay*minute);
  } else {
    clearInterval(intervalFunction);
  }
}

module.exports = {
  backUpDatabase
}

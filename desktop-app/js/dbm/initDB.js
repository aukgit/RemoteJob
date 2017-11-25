const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const dbPath = uData + '/data/data.db'
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(dbPath);

module.exports = {
  db
};

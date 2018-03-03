const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const dbPath = path.join(uData, '/data/data.db');
const sqlite3 = require('sqlite3').verbose();

/**
 * Creating database if not exist
 * Exporting the connection for further use
 */

const db = new sqlite3.Database(dbPath);

module.exports = {
  db
};

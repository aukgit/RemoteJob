const path = require('path');
const {db} = require(path.join(__dirname, './initDB'));

let createImagesTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS images (ID INTEGER PRIMARY KEY, img BLOB)");
}

/**
 * function returns last screenshot ID from DB
 * send the result as argument to callback
 */

let getLastScreeshotId = function (callback) {
  let stmt = "SELECT * FROM images ORDER BY ID DESC LIMIT 1";
  db.all(stmt, [], (err, res) => {
    if(err){
      res = { ID: 1};
      callback(res);
    } else {
      callback(res[0]);
    }
  });
}

let addScreenshot = function (imageBlob) {
  let stmt = db.prepare("INSERT INTO images (img) VALUES (?)");
  stmt.run(imageBlob);
}

let getAllScreenshot = function () {
  db.serialize(() => {
    db.all('SELECT * from images', (err, res) => {
      //console.log(res);
    });
  });
}

/**
 * Create table for images if not exists
 */

let initTables = function () {
  createImagesTable();
}

initTables();

module.exports = {
  addScreenshot,
  getLastScreeshotId,
  getAllScreenshot,
}

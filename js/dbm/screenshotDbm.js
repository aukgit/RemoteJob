const {db} = require('./initDB');

let createImagesTable = function () {
  db.run("CREATE TABLE IF NOT EXISTS images (ID INTEGER PRIMARY KEY, img BLOB)");
}

let getLastScreeshotId = function (fn) {
  let stmt = "SELECT * FROM images ORDER BY ID DESC LIMIT 1";
  db.all(stmt, [], (err, res) => {
    fn(res[0]);
  });
}

let addScreenshot = function (sc) {
  let stmt = db.prepare("INSERT INTO images (img) VALUES (?)");
  stmt.run(sc);
}

let getAllScreenshot = function () {
  db.serialize(() => {
    db.all('SELECT * from images', (err, res) => {
      //console.log(res);
    });
  });
}

let initTables = function () {
  createImagesTable();
}

initTables();

module.exports = {
  addScreenshot: addScreenshot,
  getLastScreeshotId: getLastScreeshotId,
  getAllScreenshot: getAllScreenshot,
}

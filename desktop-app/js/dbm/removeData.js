const path = require('path');
const {db} = require(path.join(__dirname,'./initDB'));

let emptySingleTable = function deleteAllDataFromTable(table) {
  db.run("DELETE FROM "+table, () => {
    db.run("VACUUM");
  });
}

let emptyAllTables = function deleteDataFromAllTable(tables) {
  tables.forEach((table) => {
    db.run("DELETE FROM "+table, () => {
      db.run("VACUUM");
    });
  });
}

module.exports = {
  emptySingleTable,
  emptyAllTables
}

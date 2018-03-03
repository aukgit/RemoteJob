const path = require('path');
const {db} = require(path.join(__dirname,'./initDB'));

let emptySingleTable = function deleteAllDataFromTable(tableName) {
  db.run("DELETE FROM "+tableName, () => {
    db.run("VACUUM");
  });
}

let emptyAllTables = function deleteDataFromAllTable(tableNames) {
  tableNames.forEach((table) => {
    db.run("DELETE FROM "+table, () => {
      db.run("VACUUM");
    });
  });
}

module.exports = {
  emptySingleTable,
  emptyAllTables
}

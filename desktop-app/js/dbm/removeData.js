const {db} = require('./initDB');

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

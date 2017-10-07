const Database = require('nedb');
let db = new nedb({
  filename: '../db/tasklist.db', autoload: true
});

exports.addTaskList = function (taskList) {
  db.insert(taskList, (err, newDocs) => {

  });
};

exports.getTaskList = function () {
  let x = db.find({}, (err, docs)=> {
    return docs;
  });
  console.log(x);
};

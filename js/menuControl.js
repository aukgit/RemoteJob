const remote = require('electron').remote;
const psList = require('ps-list');
//const database = require('./js/database');
function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.close();
  });
};

function generateProcessList() {
  psList().then((data) => {
    //database.addTaskList(data);
  //  database.getTaskList();
  console.log(data);
  });
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
    generateProcessList();
  }
};

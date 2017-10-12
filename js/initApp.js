const remote = require('electron').remote;
const path = require('path');
const processInfo = require(path.join(__dirname,'/js/processInfo'));
const database = require(path.join(__dirname,'/js/database'));
const screenshot = require(path.join(__dirname,'/js/screenshot'));


function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  database.createTableForBlob();
  database.createTableForProcessTitle();

  processInfo.getActiveWindowInfo(database.insertProcessTitle);

  screenshot.takeScreenshot();

  function processImg(){
    screenshot.takeScreenshot();

    let p = screenshot.getImgPath();
    screenshot.minifyImg(p);
    //p = screenshot.getMinImgPath();
    //screenshot.convertToBlob(p);

    setTimeout(processImg, 60000);
  }

  processImg();

  database.getAllProcesses();

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

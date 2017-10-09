const remote = require('electron').remote;
const processInfo = require('./js/processInfo');
const database = require('./js/database');
const screenshot = require('./js/screenshot');


function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  processInfo.getActiveWindowInfo();

  screenshot.takeScreenshot();

  function processImg(){
    screenshot.takeScreenshot();
    let p = screenshot.getImgPath();
    screenshot.minifyImg(p);
    p = screenshot.getImgPath();
    screenshot.convertToBlob(p);
    setTimeout(processImg,5000);
  }

  processImg();


  //database.getAllProcesses();

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

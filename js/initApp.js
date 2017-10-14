const remote = require('electron').remote;
const manageProcess = require('./js/process/manageProcess');
const manageScreenshot = require('./js/screenshot/manageScreenshot');


function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  manageProcess.addProcess();
  manageProcess.addActiveProcess();

  function contineousShot(){
    manageScreenshot.addScreenshot();
    setTimeout(contineousShot, 20000);
  }
  contineousShot();

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const dbBackup = require('./js/dbm/dbBackup');
const dbpush = require('./js/dbm/sendDatabase');
const autosave = require('./js/autosave/autosave');
const manageProcess = require('./js/process/manageProcess');
const manageScreenshot = require('./js/screenshot/manageScreenshot');

function init(config) {
  renderUI();
  renderProcess();
  manageScreenshot.addScreenshot();
  manageScreenshot.contineousShot(60000);
  dbBackup.backUpDatabase(60000);
  dbpush.sendDatabase();
  dbpush.contineouslySendDatabase(60000);
}

function renderProcess() {
  autosave.readSavedData(manageProcess.addInterruptedProcess);
  manageProcess.addProcess();
  manageProcess.addActiveProcess();
}

function renderUI() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  document.getElementById("settings").addEventListener("click", function(e) {
    ipcRenderer.send('show-preference');
  });

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const dbBackup = require('./js/dbm/dbBackup');
const processDbm = require('./js/dbm/processDbm');
const generateExcel = require('./js/dbm/generateExcel');
const dbpush = require('./js/dbm/sendDatabase');
const autosave = require('./js/autosave/autosave');
const manageProcess = require('./js/process/manageProcess');
const mt = require('./js/process/mouseTracker');
const manageImg = require('./js/screenshot/selectImageFromDB');
const manageScreenshot = require('./js/screenshot/manageScreenshot');

function init(config) {
  renderUI();
  renderProcess();
  //manageScreenshot.addScreenshot();
  manageScreenshot.contineousShot(1);
  dbBackup.backUpDatabase(2);
  dbpush.sendDatabase(2);
  generateExcel.generateExcelFile();
  //dbpush.contineouslySendDatabase(m*5);
}

function renderProcess() {
  autosave.readSavedData(manageProcess.addInterruptedProcess);
  manageProcess.addProcess();
  manageProcess.addActiveProcess();
  mt.getMousePos();
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

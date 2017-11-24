const remote = require('electron').remote;
const moment = require('moment');
const {
  ipcRenderer
} = require('electron');
const dbBackup = require('./js/dbm/dbBackup');
const processDbm = require('./js/dbm/processDbm');
const dbpush = require('./js/dbm/sendDatabase');
const autosave = require('./js/autosave/autosave');
const timer = require('./js/timer/stopwatch');
const manageProcess = require('./js/process/manageProcess');
const mt = require('./js/process/mouseTracker');
const manageScreenshot = require('./js/screenshot/manageScreenshot');

let play = false,
  time = 0,
  hours, mins, secs;

function init(config) {
  renderUI();
  renderProcess();
  manageScreenshot.contineousShot(10);
  dbBackup.backUpDatabase(5);
  //dbpush.contineouslySendDatabase(5);
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

  document.getElementById("send-data").addEventListener("click", function(e) {
    ipcRenderer.send('show-email-form');
  });

  let timerControl = document.getElementById("timerControls");
  hours = document.getElementById("hour"),
    mins = document.getElementById("mins"),
    secs = document.getElementById("secs"),
    lastUpdateTime = new Date().getTime(),
    hourCount = new Date(lastUpdateTime);
  timerControl.addEventListener('click', () => {
    if (play) {
      play = false;
      playPause();
    } else {
      play = true;
      playPause();
    }
  });

}

function playPause() {
  playPauseBtn = document.getElementById("playPauseBtn");
  if (play) {
    playPauseBtn.className = "zmdi zmdi-pause-circle-outline";
    updateTimer();
    console.log("Playing");
  } else {
    playPauseBtn.className = "zmdi zmdi-play-circle-outline";
    stopTimer();
    console.log("Paused");
  }
}

function pad(n) {
  return ('00' + n).substr(-2);
}

function updateTimer() {
  if(play){
    setTimeout(() => {
      time++;
      hour.innerHTML = pad(moment.duration(time*1000).hours())+'h';
      mins.innerHTML = pad(moment.duration(time*1000).minutes())+'m';
      secs.innerHTML = pad(moment.duration(time*1000).seconds())+'s';
      updateTimer();
    }, 1000);
  }
}


function startTimer() {
}

function stopTimer() {

}

document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    init();
  }
};

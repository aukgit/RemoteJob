const remote = require('electron').remote;
const moment = require('moment');
const path = require('path');
const {
  ipcRenderer
} = require('electron');
const dbBackup = require(path.join(__dirname, './js/dbm/dbBackup'));
const processDbm = require(path.join(__dirname, './js/dbm/processDbm'));
const dbpush = require(path.join(__dirname, './js/dbm/sendDatabase'));
const autosave = require(path.join(__dirname, './js/autosave/autosave'));
const timer = require(path.join(__dirname, './js/timer/stopwatch'));
const manageProcess = require(path.join(__dirname, './js/process/manageProcess'));
const mt = require(path.join(__dirname, './js/process/mouseTracker'));
const manageScreenshot = require(path.join(__dirname, './js/screenshot/manageScreenshot'));

let play = false,
  time = 0,
  hours, mins, secs;

function init(config) {
  renderUI();
}

function renderScreenshot() {

}

function runApp(play) {
  autosave.readSavedData(manageProcess.addInterruptedProcess, play);
  manageProcess.addProcess(play);
  manageProcess.addActiveProcess(play);
  mt.getMousePos(play);
  manageScreenshot.contineousShot(10, play);
  dbBackup.backUpDatabase(5, play);
  //dbpush.contineouslySendDatabase(5, play);
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
    autosave.readTotalWorkingTime(setWorkTime);
  timerControl.addEventListener('click', () => {
    if (play) {
      play = false;
      playPause();
      runApp(play);
    } else {
      play = true;
      playPause(play);
      runApp(play);
    }
  });

}

function setWorkTime(t) {
  if (t) {
    time = Number(t);
    hour.innerHTML = pad(moment.duration(time * 1000).hours()) + 'h';
    mins.innerHTML = pad(moment.duration(time * 1000).minutes()) + 'm';
    secs.innerHTML = pad(moment.duration(time * 1000).seconds()) + 's';
  }
}

function playPause() {
  playPauseBtn = document.getElementById("playPauseBtn");
  if (play) {
    playPauseBtn.className = "zmdi zmdi-pause-circle-outline";
    updateTimer();
  } else {
    playPauseBtn.className = "zmdi zmdi-play-circle-outline";
    //stopTimer();
  }
}

function pad(n) {
  return ('00' + n).substr(-2);
}

function updateTimer() {
  if (play) {
    setTimeout(() => {
      time++;
      hour.innerHTML = pad(moment.duration(time * 1000).hours()) + 'h';
      mins.innerHTML = pad(moment.duration(time * 1000).minutes()) + 'm';
      secs.innerHTML = pad(moment.duration(time * 1000).seconds()) + 's';
      autosave.saveTotalWorkingTime(time);
      updateTimer();
    }, 1000);
  }
}


document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    init();
  }
};

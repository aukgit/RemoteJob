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
const manageProcess = require(path.join(__dirname, './js/process/manageProcess'));
const mt = require(path.join(__dirname, './js/process/mouseTracker'));
const manageScreenshot = require(path.join(__dirname, './js/screenshot/manageScreenshot'));

const config = {
  "screenshotDelay": 10,
  "databaseBackupDelay": 5,
  "databaseSendDelay": 5
};

let isPlaying = false,
  totalWorkTime = 0,
  hours, mins, startTimer;

function init(config) {
  renderUI();
}

/**
 * After loading the main window run the app
 * main.js > it creates the login window
 * login window captures config data
 * login.js sends the config file to main window
 * mainWindow runs the runApp as the initial function
 * isPlaying is a boolean variable which indicates the state of
 * the app
 */

function runApp(isPlaying) {
  autosave.readSavedData(manageProcess.addInterruptedProcess, isPlaying);
  manageProcess.addProcess(isPlaying);
  manageProcess.addActiveProcess(isPlaying);
  mt.getMousePos(isPlaying);
  manageScreenshot.contineousShot(config.screenshotDelay, isPlaying);
  dbBackup.backUpDatabase(config.databaseBackupDelay, isPlaying);
  //dbpush.contineouslySendDatabase(config.databaseSendDelay, isPlaying);
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
    autosave.readTotalWorkingTime(setWorkTime);
  timerControl.addEventListener('click', () => {
    if (isPlaying) {
      isPlaying = false;
      playPauseApp(isPlaying);
      runApp(isPlaying);
    } else {
      isPlaying = true;
      playPauseApp(isPlaying);
      runApp(isPlaying);
    }
  });

}

/**
 * the following function set total work time after restart
 * the app from database
 */

function setWorkTime(workTime) {
  if (workTime) {
    totalWorkTime = Number(workTime);
    hour.innerHTML = pad(parseInt(totalWorkTime / 60)) + 'h';
    mins.innerHTML = pad(totalWorkTime % 60) + 'm';
  }
}

function playPauseApp(isPlaying) {
  playPauseBtn = document.getElementById("playPauseBtn");
  if (isPlaying) {
    playPauseBtn.className = "zmdi zmdi-pause-circle-outline";
    updateTimer();
  } else {
    playPauseBtn.className = "zmdi zmdi-play-circle-outline";
    updateTimer();
  }
}

function pad(n) {
  return ('00' + n).substr(-2);
}

function setTime() {
  ++totalWorkTime;
  hour.innerHTML = pad(parseInt(totalWorkTime / 60)) + 'h';
  mins.innerHTML = pad(totalWorkTime % 60) + 'm';
  autosave.saveTotalWorkingTime(totalWorkTime);
}

function updateTimer() {
  if (isPlaying) {
    startTimer = setInterval(setTime, 60000);
  } else {
    clearInterval(startTimer);
  }
}


document.onreadystatechange = function() {
  if (document.readyState === "complete") {
    init();
  }
};

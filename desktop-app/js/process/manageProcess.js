const gkm = require('gkm');
require('hazardous');
const path = require('path');
const moment = require('moment');
const activeWin = require('active-win');
const intense = require(path.join(__dirname,'./calculateIntensity'));
const autosave = require(path.join(__dirname,'./../autosave/autosave'));
const processDbm = require(path.join(__dirname,'./../dbm/processDbm'));
const screenshotDbm = require(path.join(__dirname,'./../dbm/screenshotDbm'));

const leftBtnClick = "1", middleBtnClick = "2", rightBtnClick = "3";

/**
 * Debug variables: for each mouse click event a function is
 * called for 6 times. To prevent data updated for each call these
 * variables are used
 */

let debugVarX = 0, debugVarY = 0, appRunning = false;

let mouseInfo = {
  xPos: null,
  yPos: null,
  btn: null,
  totalClick: 0,
  totalKeypress: 0
},
sequenceTime = 0, sequence = 0, currenWindowInfo;

/**
 * return active window info to callback as argument
 */

let getActiveWindow = function(callback) {
    activeWin().then((res) => {
      callback(res);
    });
};

// DEBUG: function called 6 times for each mouse event

let setMousePos = function(mouseData) {
  let mY = mouseData[0].split(",")[1],
    mX = mouseData[0].split(",")[0];
  if (mX && mY) {
    mouseInfo.xPos = mX;
    mouseInfo.yPos = mY;
  } else {
    debugVarX++;
    if (debugVarX === 6) {
      mouseInfo.totalClick++;
      mouseInfo.btn = mouseData[0];
      debugVarX = 0;
    }
  }
}

/**
 * get active process data on any mouse or keyboard event
 */

let getContinuousActiveWindow = function(callback) {

    gkm.events.on('key.*', function(data) {
      //console.log(this.event + ' ' + data);
      debugVarY++;
      if (debugVarY === 6) {
        mouseInfo.totalKeypress++;
        debugVarY = 0;
      }
      //console.log(x);
    });

    gkm.events.on('mouse.*', function(mouseData) {
      setMousePos(mouseData);
      if (mouseData[0] === leftBtnClick || mouseData[0] === middleBtnClick || mouseData[0] === rightBtnClick) {
        sequenceTime = moment().format('LT');
          getActiveWindow(callback);
      }
    });

};

let setCurrentWindowInfo = function(processInfo) {
  currenWindowInfo.title = processInfo.title;
  currenWindowInfo.started = moment().valueOf();
  sequenceTime = moment().valueOf();
};

/**
 * initialize current window info
 */

currenWindowInfo = {
  title: getActiveWindow(setCurrentWindowInfo),
  started: null,
  ended: null,
  screenshotId: null,
  mouseData: mouseInfo,
  intensity: 0,
  sequence: sequence,
  totalActiveTime: 0
};

let setIntensity = function (totalIntensity) {
  currenWindowInfo.intensity = totalIntensity;
}

/**
 * get last added screenshot ID from DB
 * set the ID to current process
 */

let setScreenshotID = function() {
  screenshotDbm.getLastScreeshotId(function(res) {
    if(res){
      currenWindowInfo.screenshotId = res.ID;
    }
  });
}

setScreenshotID();

/**
 * Add new process with pcoress ID to database if app is in
 * running states
 */

let addNewProcess = function(processInfo) {
  if (processInfo.title && appRunning) {
    processDbm.addProcess(processInfo);
  }
  //processDbm.getAllProcesses();
};

/**
 * add currently clicked or active window info to database
 * if app is in running state
 */

let addCurrentActiveProcess = function(processInfo) {

  setScreenshotID();

  if (processInfo.title !== currenWindowInfo.title) {
    setScreenshotID();
    currenWindowInfo.ended = moment().valueOf();
    intense.calcIntensity(mouseInfo, setIntensity);
    setSequence(currenWindowInfo.started);

    /**
     * for true condition last active window is saved to database
     * and reset current window info with new process info
     */

    if ((currenWindowInfo.screenshotId !== null) && (currenWindowInfo.title)) {
      let activeTime = currenWindowInfo.ended - currenWindowInfo.started;
      currenWindowInfo.totalActiveTime = parseInt(activeTime/1000); //in seconds
      if (appRunning) {
        processDbm.addActiveProcess(currenWindowInfo);
      }
      mouseInfo.totalClick = 0;
      mouseInfo.totalKeypress = 0;
    }

    currenWindowInfo.title = processInfo.title,
    currenWindowInfo.started = currenWindowInfo.ended,
    currenWindowInfo.ended = null;
  } else {
    currenWindowInfo.ended = null;
  }

};

/**
 * set secuence number for active processes within a minute
 */

function setSequence(started) {
  if(moment(started).format('LT') !== sequenceTime){
    sequence = 0;
    currenWindowInfo.sequence = sequence;
  } else {
    currenWindowInfo.sequence = sequence;
    sequence++;
  }
}

/**
 * following function backup current window info
 * for any interruption
 */

let save = function() {
  autosave.saveData(currenWindowInfo)
  setTimeout(save, 1000);
}
setTimeout(save, 1000);



let addProcess = function(isPlaying) {
    appRunning = isPlaying;
    getContinuousActiveWindow(addNewProcess);
};

let addActiveProcess = function(isPlaying) {
    appRunning = isPlaying;
    getContinuousActiveWindow(addCurrentActiveProcess);
};

/**
 * Add interrupted process to database after
 * restarting the app
 */

let addInterruptedProcess = function(processInfo) {
  processInfo.ended = Number(processInfo.ended);
  let today = moment().format('L');
  if (processInfo.title && moment(processInfo.ended).format('L') === today) {
    processDbm.addActiveProcess(processInfo);
  }
}

module.exports = {
  addProcess,
  addActiveProcess,
  addInterruptedProcess
};

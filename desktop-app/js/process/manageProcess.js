const activeWin = require('active-win');
const gkm = require('gkm');
const moment = require('moment');
const intense = require('./calculateIntensity');
const autosave = require('./../autosave/autosave');
const processDbm = require('./../dbm/processDbm');
const screenshotDbm = require('./../dbm/screenshotDbm');

let mouseInfo = {
  xPos: null,
  yPos: null,
  btn: null,
  totalClick: 0,
  totalKeypress: 0
};

let sequenceTime = 0, seq = 0;

let getActiveWindow = function(fn) {
  activeWin().then((res) => {
    fn(res);
  });
};


let c = 0;

let setMousePos = function(data) {
  let mY = data[0].split(",")[1];
  let mX = data[0].split(",")[0];
  if (mX && mY) {
    mouseInfo.xPos = mX;
    mouseInfo.yPos = mY;
  } else {
    c++;
    if (c == 6) {
      mouseInfo.totalClick++;
      mouseInfo.btn = data[0];
      c = 0;
      //console.log(mouseInfo);
    }
  }
}



let x = 0;

let getContinuousActiveWindow = function(fn) {

  gkm.events.on('key.*', function(data) {
    //console.log(this.event + ' ' + data);
    x++;
    if (x == 6) {
      mouseInfo.totalKeypress++;
      x = 0;
    }
    //console.log(x);
  });

  gkm.events.on('mouse.*', function(data) {
    setMousePos(data);
    if (data[0] === "1" || data[0] === "2" || data[0] === "3") {
      sequenceTime = moment().format('LT');
      getActiveWindow(fn);
    }
  });

};

let setCurrentWindowInfo = function(p) {
  currenWindow.title = p.title;
  currenWindow.started = Number(moment().format('x'));
  sequenceTime = moment().format('LT');
};

let currenWindow = {
  title: getActiveWindow(setCurrentWindowInfo),
  started: null,
  ended: null,
  screenshotId: null,
  mouseData: mouseInfo,
  intensity: 0,
  sequence: seq,
  totalActiveTime: 0
};

let setIntensity = function (i) {
  currenWindow.intensity = i;
}

let setScreenshotID = function() {
  screenshotDbm.getLastScreeshotId(function(res) {
    currenWindow.screenshotId = res.ID;
  });
}
setScreenshotID();

let addNewProcess = function(info) {
  if (info.title) {
    processDbm.addProcess(info);
  }
  processDbm.getAllProcesses();
};


let addCurrentActiveProcess = function(info) {
  setScreenshotID();
  if (info.title !== currenWindow.title) {

    setScreenshotID();

    currenWindow.ended = Number(moment().format('x'));

    intense.calcIntensity(mouseInfo, setIntensity);

    setSequence(currenWindow.started);

    if ((currenWindow.screenshotId !== null) && (currenWindow.title)) {
      processDbm.addActiveProcess(currenWindow);
      mouseInfo.totalClick = 0;
      mouseInfo.totalKeypress = 0;
    }

    currenWindow.title = info.title,
    currenWindow.started = currenWindow.ended,
    currenWindow.ended = null;
  } else {
    currenWindow.ended = null;
    //console.log("Active: ", currenWindow);
  }
};

function setSequence(started) {
  if(moment(started,'LTS').format('LT') !== sequenceTime){
    seq = 0;
    currenWindow.sequence = seq;
  } else {
    currenWindow.sequence = seq;
    seq++;
  }
}

let save = function() {
  autosave.saveData(currenWindow)
  setTimeout(save, 1000)
}

setTimeout(save, 1000);

let addProcess = function() {
  getContinuousActiveWindow(addNewProcess);
};

let addActiveProcess = function() {
  getContinuousActiveWindow(addCurrentActiveProcess);
};

let addInterruptedProcess = function(p) {
  if (p.title) {
    processDbm.addActiveProcess(p);
  }
}

module.exports = {
  addProcess: addProcess,
  addActiveProcess: addActiveProcess,
  addInterruptedProcess: addInterruptedProcess
};

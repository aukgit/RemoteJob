const gkm = require('gkm');
require('hazardous');
const path = require('path');
const moment = require('moment');
const activeWin = require('active-win');
const intense = require(path.join(__dirname,'./calculateIntensity'));
const autosave = require(path.join(__dirname,'./../autosave/autosave'));
const processDbm = require(path.join(__dirname,'./../dbm/processDbm'));
const screenshotDbm = require(path.join(__dirname,'./../dbm/screenshotDbm'));

let mouseInfo = {
  xPos: null,
  yPos: null,
  btn: null,
  totalClick: 0,
  totalKeypress: 0
};

let sequenceTime = 0, seq = 0, x = 0;

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
    }
  }
}

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
  currenWindow.started = moment().valueOf();
  sequenceTime = moment().valueOf();
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
    if(res){
      currenWindow.screenshotId = res.ID;
    }
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

    currenWindow.ended = moment().valueOf();

    intense.calcIntensity(mouseInfo, setIntensity);

    setSequence(currenWindow.started);

    if ((currenWindow.screenshotId !== null) && (currenWindow.title)) {
      let t = currenWindow.ended - currenWindow.started;
      currenWindow.totalActiveTime = parseInt(t/1000);
      console.log(currenWindow.totalActiveTime);
      processDbm.addActiveProcess(currenWindow);
      mouseInfo.totalClick = 0;
      mouseInfo.totalKeypress = 0;
    }

    currenWindow.title = info.title,
    currenWindow.started = currenWindow.ended,
    currenWindow.ended = null;
  } else {
    currenWindow.ended = null;
  }
};

function setSequence(started) {
  if(moment(started).format('LT') !== sequenceTime){
    seq = 0;
    currenWindow.sequence = seq;
  } else {
    currenWindow.sequence = seq;
    seq++;
  }
}

let save = function() {
  autosave.saveData(currenWindow)
  setTimeout(save, 1000);
}

setTimeout(save, 1000);

let addProcess = function(play) {
  if (play) {
    getContinuousActiveWindow(addNewProcess);
  }
};

let addActiveProcess = function(play) {
  if (play) {
    getContinuousActiveWindow(addCurrentActiveProcess);
  }
};

let addInterruptedProcess = function(p) {
  p.ended = Number(p.ended);
  let today = moment().format('L');
  if (p.title && moment(p.ended).format('L') === today) {
    processDbm.addActiveProcess(p);
  }
}

module.exports = {
  addProcess,
  addActiveProcess,
  addInterruptedProcess
};

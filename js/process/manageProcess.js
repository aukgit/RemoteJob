const activeWin = require('active-win');
const gkm = require('gkm');
const moment = require('moment');
const processDbm = require('./../dbm/processDbm');

let getActiveWindow = function (fn) {
  activeWin().then((res) => {
    fn(res);
  });
};

let getContinuousActiveWindow = function (fn) {
  gkm.events.on('mouse.clicked', (err, data) => {
    getActiveWindow(fn);
  });
}

let setCurrentWindowInfo = function (p) {
  currenWindow.title = p.title;
  currenWindow.started = moment().format('LTS');
  console.log(currenWindow);
}

let currenWindow  = {
  title: getActiveWindow(setCurrentWindowInfo),
  started: null,
  ended: null
};


let addNewProcess = function (info) {
  if(info.title){
    processDbm.addProcess(info);
  }
  processDbm.getAllProcesses();
}

let addCurrentActiveProcess = function (info) {

  if(info.title !== currenWindow.title){
    currenWindow.ended = moment().format('LTS');
    console.log("Ended: ", currenWindow);
    currenWindow.title = info.title,
    currenWindow. started = currenWindow.ended,
    currenWindow.ended = null;
  } else {
    console.log("Active: ", currenWindow);
  }
}

let addProcess = function () {
  getContinuousActiveWindow(addNewProcess);
}

let addActiveProcess = function () {
  getContinuousActiveWindow(addCurrentActiveProcess);
}

module.exports = {
  addProcess: addProcess,
  addActiveProcess: addActiveProcess
};

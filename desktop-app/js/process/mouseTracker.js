const activeWin = require('active-win');
const gkm = require('gkm');
const moment = require('moment');
//const autosave = require('./../autosave/autosave');
const processDbm = require('./../dbm/processDbm');
//const screenshotDbm = require('./../dbm/screenshotDbm');

let mouseInfo = {
  xPos: null,
  yPos: null,
  btn: null,
  clickedAt: null
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
    if (c == 1){
      mouseInfo.btn = data[0];
    }
    if (c == 3) {
      mouseInfo.clickedAt = Number(moment().format('x'));
      //console.log(mouseInfo);
      processDbm.addMousePos(mouseInfo);
      c = 0;
    }
  }
}

let getMousePos = function(fn) {
  gkm.events.on('mouse.*', function(data) {
    setMousePos(data);
  });
};



module.exports = {
  getMousePos
};

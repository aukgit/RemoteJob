const gkm = require('gkm');
require('hazardous');
const path = require('path');
const moment = require('moment');
const activeWin = require('active-win');
const processDbm = require(path.join(__dirname, './../dbm/processDbm'));

/**
 * if an app runs from command line mouse x,y and click will
 * be null
 */

let mouseInfo = {
  xPos: null,
  yPos: null,
  btn: null,
  clickedAt: null
};

/**
 * Debug variables: for each mouse click event a function is
 * called for 6 times. To prevent data updated for each call these
 * variables are used
 */

 let debugVarX = 0;

/**
 * save mouse position data for each event
 */

let setMousePos = function(mouseData) {

  let mY = mouseData[0].split(",")[1];
  let mX = mouseData[0].split(",")[0];
  if (mX && mY) {
    mouseInfo.xPos = mX;
    mouseInfo.yPos = mY;
  } else {
    debugVarX++;
    if (debugVarX === 1){
      mouseInfo.btn = mouseData[0];
    }
    if (debugVarX === 3) {
      mouseInfo.clickedAt = Number(moment().format('x'));
      //console.log(mouseInfo);
      processDbm.addMousePos(mouseInfo);
      debugVarX = 0;
    }
  }
}

let getMousePos = function(isPlaying) {
  if (isPlaying) {
    gkm.events.on('mouse.*', function(mouseData) {
      setMousePos(mouseData);
    });
  }
};


module.exports = {
  getMousePos
};

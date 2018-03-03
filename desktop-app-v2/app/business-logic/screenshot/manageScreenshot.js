const fs = require('fs');
require ('hazardous');
const path = require('path');
const imagemin = require('imagemin');
const screenshot = require('desktop-screenshot');
const imageminJpegtran = require('imagemin-jpegtran');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const screenshotDbm = require(path.join(__dirname, '../dbm/screenshotDbm'));
const minute = 60000;
let intervalFunction;

/**
 * take desktop screenshot using desktop-screenshot package
 * and save to user app data location
 * C:\Users\username\AppData\Roaming\RemoteJob\data\img (in windows)
 */

let takeScreenshot = function() {
  screenshot(path.join(uData, '/data/img/sc.jpg'), {
    quality: 45
  }, (error, complete) => {
    if (error) {
      console.log("Screenshot failed", error);
    } else {
      minifyImg();
    }
  });
}


/**
 * this function contineously take screenshot
 * delayTime is defined by the configuration
 */

let contineousShot = function (delayTime, isPlaying) {
  if (isPlaying) {
    takeScreenshot();
    intervalFunction = setInterval(takeScreenshot, delayTime*minute);
  } else {
    clearInterval(intervalFunction);
  }
}

/**
 * minify image to save on db
 * call generateBlob to generate binary string from image
 */

let minifyImg = function() {

  let imgPath = path.join(uData, '/data/img/sc.jpg');

  imagemin([imgPath], path.join(uData, '/data/img/min'), {
    use: [imageminJpegtran()]
  }).then(() => {
    let imgPath = path.join(uData, '/data/img/min/sc.jpg');
    generateBlob(imgPath);
  });

}

/**
 * save generated blob to database by calling
 * screenshotDbm.js > addScreenshot
 */

let generateBlob = function(imgPath) {
  let imgBlob = null;
  fs.readFile(imgPath, (error, data) => {
    let imgBlob = new Buffer(data, 'binary').toString('base64');
    if (imgBlob) {
      screenshotDbm.addScreenshot(imgBlob);
    }
    screenshotDbm.getAllScreenshot();
  });
  return imgBlob;
}

let addScreenshot = function() {
  takeScreenshot();
}

module.exports = {
  addScreenshot,
  contineousShot
}

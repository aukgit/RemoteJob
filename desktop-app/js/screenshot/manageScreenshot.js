const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const screenshot = require('desktop-screenshot');
const imageminJpegtran = require('imagemin-jpegtran');
const screenshotDbm = require(path.join(__dirname, '../dbm/screenshotDbm'));
const minute = 60000;

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

let contineousShot = function (delay, play) {
  if (play) {
    function takeShot() {
      takeScreenshot();
      setTimeout(takeShot, delay*minute);
    }
    takeShot();
  }
}

let minifyImg = function() {

  let imgPath = path.join(uData, '/data/img/sc.jpg');

  imagemin([imgPath], path.join(uData, '/data/img/min'), {
    use: [imageminJpegtran()]
  }).then(() => {
    let imgPath = path.join(uData, '/data/img/min/sc.jpg');
    generateBlob(imgPath);
  });

}

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

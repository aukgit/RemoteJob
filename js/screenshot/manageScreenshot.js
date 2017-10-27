const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const screenshotDbm = require('../dbm/screenshotDbm');
const screenshot = require('desktop-screenshot');
//const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');

let takeScreenshot = function() {
  screenshot(path.join(__dirname, './../../img/sc.jpg'), {
    quality: 45
  }, (error, complete) => {
    if (error) {
      console.log("Screenshot failed", error);
    } else {
      minifyImg();
    }
  });
}

let contineousShot = function (delay) {
  function takeShot() {
    takeScreenshot();
    setTimeout(takeShot, delay);
  }
  takeShot();
}

let minifyImg = function() {
  let imgPath = path.join(__dirname, '../../img/sc.jpg');

  imagemin([imgPath], 'img/min', {
    use: [imageminJpegtran()]
  }).then(() => {
    let imgPath = path.join(__dirname, './../../img/min/sc.jpg');
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
  addScreenshot: addScreenshot,
  contineousShot: contineousShot
}

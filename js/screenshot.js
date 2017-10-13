const screenshot = require('desktop-screenshot');
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const database = require('./database');

module.exports = {
  takeScreenshot: function() {
    let self = this;

    screenshot(path.join(__dirname, '../img/sc.png'), {
      quality: 25
    }, function(error, complete) {
      if (error) {
        console.log("Screenshot failed", error);
      } else {
        let p = self.getImgPath();
        self.minifyImg(p);
        console.log("Screenshot succeeded");
      }
    });

  },
  getImgPath: function() {
    return path.join(__dirname, '../img/sc.png');
  },
  getMinImgPath: function() {
    return path.join(__dirname, '../img/min/sc.png');
  },
  minifyImg: function(p) {

    imagemin([p], 'img/min', {
      use: [imageminPngquant({quality: '10-20'})]
    }).then(() => {
      console.log('Images optimized');
    });


  },
  convertToBlob: function(p) {
    fs.readFile(p, (error, data) => {
      let encodedImage = new Buffer(data, 'binary').toString('base64');
      database.insertScreenshotBlob(encodedImage);
    });
  }
}

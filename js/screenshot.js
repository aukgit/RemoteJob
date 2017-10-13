const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const database = require('./database');

module.exports = {
  takeScreenshot: function() {
    //screenshot('sc.png').desktop();
    let self = this;
    screenshot().then((img) => {
      saveImg(img);

      function saveImg(img) {
        //console.log("Writing Img");
        var myBuffer = new Buffer(img.length);
        for (let i = 0; i < img.length; i++) {
          myBuffer[i] = img[i];
        }
        fs.writeFile(path.join(__dirname, '../img/sc.jpg'), myBuffer, function(err) {
          if (err) {
            console.log(err);
          } else {
            let p = self.getImgPath();
            self.minifyImg(p);
          }
        });
      }
    }).catch((err) => {
      // ...
    });
  },
  getImgPath: function() {
    return path.join(__dirname, '../img/sc.jpg');
  },
  getMinImgPath: function() {
    return path.join(__dirname, '../img/min/sc.jpg');
  },
  minifyImg: function(p) {

    imagemin([p], 'img/min', {
      use: [imageminJpegtran()]
    }).then(() => {
      let p = this.getMinImgPath();
      this.convertToBlob(p);
    });

  },
  convertToBlob: function(p) {
    fs.readFile(p, (error, data) => {
      let encodedImage = new Buffer(data, 'binary').toString('base64');
      database.insertScreenshotBlob(encodedImage);
    });
  }
}

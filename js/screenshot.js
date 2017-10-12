//const screenshot = require('node-screenshot');
const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const blobUtil = require('blob-util');
const database = require('./database');

module.exports = {
  takeScreenshot: function() {
    //screenshot('sc.png').desktop();
    screenshot().then((img) => {
      saveImg(img);
      function saveImg(img) {
        //console.log("Writing Img");
        var myBuffer = new Buffer(img.length);
        for (let i = 0; i < img.length; i++) {
          myBuffer[i] = img[i];
        }
        fs.writeFile(path.join(__dirname,'../img/sc.png'), myBuffer, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        });
      }
    }).catch((err) => {
      // ...
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
      plugins: [
        imageminPngquant({
          quality: '65-75'
        })
      ]
    }).then(files => {

    });
  },
  convertToBlob: function(p) {
    let b = blobUtil.imgSrcToBlob(p).then((blob) => {
      database.insertBlob(blob);
    }).catch((err) => {

    });
  }
}

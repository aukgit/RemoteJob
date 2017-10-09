const screenshot = require('node-screenshot');
const path = require('path');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const blobUtil = require('blob-util');
module.exports = {
  takeScreenshot: function() {
    screenshot('sc.png').desktop();
  },
  getImgPath: function() {
    return path.join(__dirname, '../sc.png');
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
      console.log(blob);
    }).catch((err) => {

    });
  }
}

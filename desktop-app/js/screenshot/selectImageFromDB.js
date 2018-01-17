const path = require('path');
const {db} = require(path.join(__dirname, '../dbm/initDB'));

/**
 * this function get total image count from database
 */

let totalImages = function totalImagesInDatabase(callbackOne, callbackTwo) {
  db.serialize(() => {
    db.all('SELECT COUNT(*) as count from Images', (err, res) => {
      if(res){
        generateImgList(res[0].count, callbackOne, callbackTwo);
      }
    });
  });
}

let randomNum = function generateRandomNumber(min, max) {
  return Math.floor(max - Math.random()*(max-min));
}

/**
 * this function generate random image ID for every one hour
 * each hour has 6 images
 * 1 image will be selected from each 6
 */

let generateImgList = function selectImageFromDB(totalImage, callbackOne, callbackTwo) {
  let loop = Math.ceil(totalImage/6);
  let start = 1, end = start+6, id = 0, imgList = [];
  for (let i = 0; i < loop; i++) {
    if(totalImage < 6){
      end = start + totalImage;
      id = randomNum(start, end);
    } else {
      id = randomNum(start, end);
    }
    totalImage -= 6; start += 6; end += 6;
    imgList.push(id);
  }
  callbackOne(imgList, callbackTwo);
}

/**
 * this function generate random image id list for each hour
 * it takes two parameters:
 * callbackOne: get the image blob from DB and create images
 * callbackTwo: mail > emailPackager.js > compressDB
 */

let selectImg = function selectImages(callbackOne, callbackTwo) {
  totalImages(callbackOne, callbackTwo);
}

module.exports = {
  selectImg
}

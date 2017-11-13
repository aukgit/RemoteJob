const {db} = require('../dbm/initDB');

let finImgList = [];

let totalImages = function totalImagesInDatabase(fn, callback) {
  db.serialize(() => {
    db.all('SELECT COUNT(*) as count from Images', (err, res) => {
      if(res){
        generateImgList(res[0].count, fn, callback);
      }
    });
  });
}

let randomNum = function generateRandomNumber(max, min) {
  return Math.floor(max - Math.random()*(max-min));
}

let generateImgList = function selectImageFromDB(totalImage, fn, callback) {
  let loop = Math.ceil(totalImage/5);
  let s = 1, e = s+4, id = 0, imgList = [];
  for (let i = 0; i < loop; i++) {
    if(totalImage < 5){
      e = s + totalImage - 1;
      id = randomNum(s,e);
    } else {
      id = randomNum(s,e);
    }
    totalImage -= 5; s += 5; e += 4;
    imgList.push(id);
  }
  fn(imgList, callback);
}

let selectImg = function selectImages(fn, callback) {
  totalImages(fn, callback);
}

module.exports = {
  selectImg
}

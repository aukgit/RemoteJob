const {db} = require('../dbm/initDB');
const base64ToImage = require('base64-to-image');
const sm = require('./selectImageFromDB');
const path = require('path');
const fs = require('fs');
const imgPath = path.join(__dirname, '../../email-data/img');

let fileInfo = {
  username: 'username_',
  fileName: '',
  type:'jpg',
  path: imgPath
};

let getImage = function getImageFromDB(list) {
    for (let i = 0; i < list.length; i++) {
      db.serialize(() => {
      db.all('SELECT *  from Images WHERE id='+list[i], (err, res) => {
        fileInfo.fileName = fileInfo.username + list[i];
        return createImage(res[0].img, fileInfo);
      });
    });
  }
}

let createImage = function createImageFromString(img, fileInfo) {
  fs.writeFile(imgPath+"/"+fileInfo.fileName+"."+fileInfo.type, img, 'base64', (err) => {
    if(err){
      console.log(err);
    }
  });
}

let generateImg = function generateImages() {
  sm.selectImg(getImage);
}

module.exports = {
  generateImg
}

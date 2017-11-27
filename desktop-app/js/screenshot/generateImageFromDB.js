const fs = require('fs');
const path = require('path');
const base64ToImage = require('base64-to-image');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const imgPath = uData + '/data/dataPack';
const {db} = require(path.join(__dirname, '../dbm/initDB'));
const sm = require(path.join(__dirname, './selectImageFromDB'));

let fileInfo = {
  username: 'shahids_',
  fileName: '',
  type:'jpg',
  path: imgPath
};

let images = [];

let setImages = function setImages(imgs, callback) {
  images = imgs;
  let p = images.map(createImage);
  Promise.all(p).then(callback);
}

let getImage = function getImageFromDB(list, callback) {
  let imgs = [];
    for (let i = 0; i < list.length; i++) {
      db.serialize(() => {
      db.all('SELECT *  from Images WHERE id='+list[i], (err, res) => {
        fileInfo.fileName = fileInfo.username + list[i];
        imgs.push(res[0].img);
        if(imgs.length === list.length){
          setImages(imgs, callback);
        }
      });
    });
  }
}

let createImage = function createImageFromString(img, c) {
  return new Promise((res, rej) => {
    fs.writeFile(imgPath+"/"+fileInfo.fileName+c+"."+fileInfo.type, img, 'base64', (err) => {
      if(err){
        console.log(err);
        rej(err);
      } else {
        res(img);
      }
    });
  });
}

let generateImg = function generateImages(fn) {
  sm.selectImg(getImage, fn);
}

module.exports = {
  generateImg
}

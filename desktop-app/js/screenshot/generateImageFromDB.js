const fs = require('fs');
const path = require('path');
const base64ToImage = require('base64-to-image');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const imgPath = path.join(uData, '/data/dataPack');
const {db} = require(path.join(__dirname, '../dbm/initDB'));
const imageSelector = require(path.join(__dirname, './selectImageFromDB'));

/**
 * meta data configuration for image file
 */

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

/**
 * get image blob from the database and
 * send to setImage promise to generate image from blob one after
 * another
 */

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

/**
 * Create image from blob one after another
 */

let createImage = function createImageFromString(img, imageID) {
  return new Promise((res, rej) => {
    fs.writeFile(imgPath+"/"+fileInfo.fileName+imageID+"."+fileInfo.type, img, 'base64', (err) => {
      if(err){
        console.log(err);
        rej(err);
      } else {
        res(img);
      }
    });
  });
}

/**
 * call selectImg to randomly select image for each hour
 */

let generateImg = function generateImages(callback) {
  imageSelector.selectImg(getImage, callback);
}

module.exports = {
  generateImg
}

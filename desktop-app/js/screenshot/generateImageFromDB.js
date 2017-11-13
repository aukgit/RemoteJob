const {db} = require('../dbm/initDB');
const base64ToImage = require('base64-to-image');
const sm = require('./selectImageFromDB');
const path = require('path');
const fs = require('fs');
const imgPath = path.join(__dirname, '../../data/img');

let fileInfo = {
  username: 'username_',
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

// let getImage = function getImageFromDB(list) {
//     for (let i = 0; i < list.length; i++) {
//       db.serialize(() => {
//       db.all('SELECT *  from Images WHERE id='+list[i], (err, res) => {
//         fileInfo.fileName = fileInfo.username + list[i];
//         createImage(res[0].img, fileInfo);
//       });
//     });
//   }
// }


let createImage = function createImageFromString(img, c) {
  return new Promise((res, rej) => {
    fs.writeFile(imgPath+"/"+fileInfo.fileName+c+"."+fileInfo.type, img, 'base64', (err) => {
      if(err){
        rej(err);
      } else {
        console.log(fileInfo.fileName);
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

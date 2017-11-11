const {db} = require('../dbm/initDB');
const base64ToImage = require('base64-to-image');
const sm = require('./selectImageFromDB');
const path = require('path');
const fs = require('fs');
const imgPath = path.join(__dirname, '../../email-data/img');

let fileInfo = {'fileName': 'username_', 'type':'png'};

let getImage = function getImageFromDB(list) {
  db.serialize(() => {
    for (let i = 0; i < list.length; i++) {
      fileInfo.fileName += list[i];
      db.all('SELECT *  from Images WHERE id='+list[i], (err, res) => {
        fs.writeFile(imgPath+"/"+fileInfo.fileName+"."+fileInfo.type, res[0].img, 'base64', (err) => {
          //console.log(err);
        });
        console.log(list[i]);
      });
      fileInfo.fileName = "username_";
    }
  });
}

let generateImg = function generateImages() {
  sm.selectImg(getImage);
}

module.exports = {
  generateImg
}

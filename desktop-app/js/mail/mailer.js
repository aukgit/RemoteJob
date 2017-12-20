const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const nodemailer = require('nodemailer');
const removeData = require(path.join(__dirname, '../dbm/removeData'));

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.test.json')));

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: config.email,
    pass: config.pass
  },
  tls: {
    rejectUnauthorized: false
  }
});

let HelperOptions = {
  from: `Shahidul Islam Majumder <${config.email}>`,
  to: 'devorg.bd@gmail.com',
  subject: 'Daily Activity Email',
  text: 'This is the body text'
};

let sendEmail = function sendMailWithData(msg) {
  HelperOptions.subject = msg.subject;
  HelperOptions.text = msg.description;
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Sent:', info);
    }
  });
}

let removeDirData = function removeData(datapath) {
  fs.readdir(datapath, (err, files) => {
    if (err)
      throw err;

    for (let file of files) {
      fs.unlink(path.join(datapath, file), err => {
        if (err)
          throw err;
        }
      );
    }
  });
}


let sendData = function(msg, file) {
  HelperOptions.attachments = file;
  HelperOptions.subject = msg.subject;
  HelperOptions.text = msg.description;
  if (HelperOptions.attachments) {
    transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        const dataPack = path.join(uData, '/data/dataPack'),
              emailData = path.join(uData, '/data/emailData');
        setTimeout(removeData.emptyAllTables(['ActiveProcesses', 'MousePos', 'Processes', 'images','Temp']),5000);
        setTimeout(removeDirData,4000,dataPack);
        setTimeout(removeDirData,5000,emailData);
      }
    });
  }
}

module.exports = {
  sendData,
  sendEmail
}

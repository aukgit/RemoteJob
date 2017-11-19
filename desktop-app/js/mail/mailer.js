const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const removeData = require('../dbm/removeData');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));

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

let sendData = function (msg, file) {
  HelperOptions.attachments = file;
  HelperOptions.subject = msg.subject;
  HelperOptions.text = msg.description;
  if (HelperOptions.attachments) {
    transporter.sendMail(HelperOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        removeData.emptyAllTables(['ActiveProcesses','MousePos','Processes','images']);
      }
    });
  }
}

module.exports = {
  sendData,
  sendEmail
}

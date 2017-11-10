const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

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
  from: `Shahid <${config.email}>`,
  to: 'hello@shahids.me',
  subject: 'Database from SIM',
  text: 'Hello there'
};

let sendDB = function (file) {
  HelperOptions.attachments = file;
  // transporter.sendMail(HelperOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Mail sent!');
  //     console.log('Info:', info);
  //   }
  // });
}

module.exports = {
  sendDB
}

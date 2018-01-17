const path = require('path');
const moment = require('moment');
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const mailer = require(path.join(__dirname,'../js/mail/mailer'));
const autosave = require(path.join(__dirname,'../js/autosave/autosave'));
const packeger = require(path.join(__dirname,'../js/mail/emailPackager'));
const {db} = require(path.join(__dirname, '../js/dbm/initDB'));

let emailForm = document.getElementById("emailForm");
emailForm.addEventListener('submit', generateEmail);
let startedTime = null, message = {}, mailSubject = {};


function init() {
  renderUI();
}

function renderUI() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });
}

function setTotalWorkingTime(total) {
  mailSubject.total = (Number(total)/60).toFixed(2);
  formatAndPackage();
}

function setStartedTime(time) {
  mailSubject.startedTime = time;
  autosave.readTotalWorkingTime(setTotalWorkingTime);
}

/**
 * format email and package data for attachment
 * mail > emailPackager.js > packageData is used to
 * package data
 */

function formatAndPackage() {
  message.subject = `Shahidul Islam Majumder [${moment().format('DD-MMM-YYYY')}] [${mailSubject.startedTime}] - [${moment().format('hh:mma')}] - [${mailSubject.total} hours] - (ended)`;
  packeger.packageData(message);
  setTimeout(autosave.resetData, 5000);
}

/**
 * generate email based on start or ended
 * send the generated email by using
 * mail > mailer.js > sendEmail function
 */

function generateEmail(event) {
  event.preventDefault();
  let emailType = document.querySelector('input[name = "emailType"]:checked').value;
  //subject = document.getElementById("subject").value,
  description = document.getElementById("description").value;
  message.description = description;
  if (emailType === "ended") {
    autosave.readStartedTime(setStartedTime);
  } else {
    let startedTime = moment().format('hh:mma');
    autosave.saveStartedTime(startedTime);
    message.subject = `Shahidul Islam Majumder [${moment().format('DD-MMM-YYYY')}] [${startedTime}] - (started)`;
    mailer.sendEmail(message);
  }
  const window = remote.getCurrentWindow();
  window.hide();
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

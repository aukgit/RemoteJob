const path = require('path');
const moment = require('moment');
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const mailer = require(path.join(__dirname,'../js/mail/mailer'));
const autosave = require(path.join(__dirname,'../js/autosave/autosave'));
const packeger = require(path.join(__dirname,'../js/mail/emailPackager'));

let emailForm = document.getElementById("emailForm");
emailForm.addEventListener('submit', generateEmail);
let startedTime = null, msg = {}, mailSubject = {};


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
  mailSubject.total = (Number(total)/(60*60)).toFixed(2);
  console.log(mailSubject.total);
  formatAndPackage();
}

function setStartedTime(time) {
  mailSubject.startedTime = time;
  autosave.readTotalWorkingTime(setTotalWorkingTime);
}

function formatAndPackage() {
  msg.subject = `Shahidul Islam Majumder [${moment().format('DD-MMM-YYYY')}] [${mailSubject.startedTime}] - [${moment().format('hh:mma')}] - [${mailSubject.total} hours] - (ended)`;
  packeger.packageData(msg);
  setTimeout(autosave.resetData(),2000);
}

function generateEmail(e) {
  e.preventDefault();
  let emailType = document.querySelector('input[name = "emailType"]:checked').value;
  //subject = document.getElementById("subject").value,
  description = document.getElementById("description").value;
  msg.description = description;
  if (emailType === "ended") {
    autosave.readStartedTime(setStartedTime);
  } else {
    let startedTime = moment().format('hh:mma');
    autosave.saveStartedTime(startedTime);
    msg.subject = `Shahidul Islam Majumder [${moment().format('DD-MMM-YYYY')}] [${startedTime}] - (started)`;
    mailer.sendEmail(msg);
  }
  const window = remote.getCurrentWindow();
  window.hide();
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

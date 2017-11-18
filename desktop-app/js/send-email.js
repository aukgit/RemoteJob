const moment = require('moment');
const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const mailer = require('../js/mail/mailer');
const autosave = require('../js/autosave/autosave');
const packeger = require('../js/mail/emailPackager');

let emailForm = document.getElementById("emailForm");
emailForm.addEventListener('submit', generateEmail);
let startedTime = null, msg = {};


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

function setStartedTime(time) {
  startedTime = time;
  msg.subject = `Shahidul Islam Majumder [${moment().format('DD-MMM-YYYY')}] [${startedTime}] - [${moment().format('hh:mma')}] - [7 hours] - (ended)`;
  packeger.packageData(msg);
  autosave.resetData();
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

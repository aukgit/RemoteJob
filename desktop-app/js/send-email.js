const remote = require('electron').remote;
const {ipcRenderer} = require('electron');
const mailer = require('../js/mail/mailer');
const autosave = require('../js/autosave/autosave');
const packeger = require('../js/mail/emailPackager');

let emailForm = document.getElementById("emailForm");
emailForm.addEventListener('submit', generateEmail);

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

function generateEmail(e) {
  e.preventDefault();
  let msg = {},
  emailType = document.querySelector('input[name = "emailType"]:checked').value;
  subject = document.getElementById("subject").value,
  description = document.getElementById("description").value;
  msg.subject = subject;
  msg.description = description;

  if (emailType === "ended") {
    packeger.packageData(msg);
    autosave.resetData();
  } else {
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

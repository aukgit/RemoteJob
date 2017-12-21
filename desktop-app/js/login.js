const remote = require('electron').remote;
const {ipcRenderer} = require('electron');


let form = document.querySelector('#loginForm');
form.addEventListener('submit',requestAuth);

function init(config) {
  renderUI();
}

function renderUI() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    ipcRenderer.send('close-app');
  });
}

/**
 * request for online authentication and set
 * app config file from response
 */

function requestAuth(e) {
  e.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  if(email && password){
    let config = {
      "ScreenshotTakingTime": 5,
      "ServerSyncTime": 10,
      "DatabaseBackup": 5,
      "ClientName": "x-Product",
      "EmployeeName": "John Doe",
      "ContractType": "Working In a Private Company",
      "Salary": 1000,
      "SalaryType": "monthly",
      "WeeklyFixedhours": 28,
      "LastTimeSyncWithServer": "06:15",
      "IsCameraOn:": false,
      "TimeZone": "UTC+6",
      "EncryptionCode": "fe1660b81c1289e120bac035c5d182c8652e7df5"
    };
    loadMainWindow(config);
  } else {

  }
}

function loadMainWindow(config) {
  ipcRenderer.send('loadMainWindow', config);
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

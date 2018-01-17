const remote = require('electron').remote;
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const {
  ipcRenderer
} = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');


let form = document.querySelector('#loginForm');
form.addEventListener('submit', requestAuth);

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
    ipcRenderer.send('close-app');
  });
}

function saveAppConfig(config) {
  const configPath = path.join(uData, 'appconfig.json');
  fs.writeFile(configPath, JSON.stringify(config), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    loadMainWindow();
  });
}

/**
 * request for online authentication and
 * save the app config as appconfig.json on user data directory
 */


function requestAuth(e) {
  e.preventDefault();
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  if (email && password) {
    let config = JSON.parse(fs.readFileSync(path.join(__dirname, '../appconfig.json')));
    saveAppConfig(config);
  } else {
    console.log('Authentication failed!');
  }
}

function loadMainWindow() {
  ipcRenderer.send('loadMainWindow');
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

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
    window.hide();
  });

  document.getElementById("settings").addEventListener("click", function(e) {
    ipcRenderer.send('show-preference');
  });

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

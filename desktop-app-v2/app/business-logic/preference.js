const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

function init(config) {
  renderUI();
}

function renderUI() {
  document.getElementById("cancel").addEventListener("click", function(e) {
    ipcRenderer.send('hide-preference');
  });

}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

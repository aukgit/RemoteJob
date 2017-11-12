const remote = require('electron').remote;
const {ipcRenderer} = require('electron');

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
  let started = document.getElementById("started").value;
  let ended = document.getElementById("ended").value;
  let description = document.getElementById("description").value;
  console.log(`Started: ${started}, Ended: ${ended}, Details: ${description}`);
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
  }
};

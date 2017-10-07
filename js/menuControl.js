const remote = require('electron').remote;
const activeWin = require('active-win');

var gkm = require('gkm');

function init() {
  document.getElementById("minimize").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.minimize();
  });

  document.getElementById("close").addEventListener("click", function(e) {
    const window = remote.getCurrentWindow();
    window.hide();
  });

  gkm.events.on('mouse.*', function(data) {
    console.log(data);
    getActiveWindowProcessInfo();
  });

};

let pid = 0;

function getActiveWindowProcessInfo() {
  activeWin().then(res => {
    console.log(res);
  });
}

document.onreadystatechange = function() {
  if (document.readyState == "complete") {
    init();
    //generateProcessList();
    getActiveWindowProcessInfo();
  }
};

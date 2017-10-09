const activeWin = require('active-win');
const gkm = require('gkm');

module.exports = {
  getActiveWindowInfo: function (fn) {
    gkm.events.on('mouse.clicked', (err, data) => {
      activeWin().then((res) => {
        fn(res);
      });
    });
  }
};

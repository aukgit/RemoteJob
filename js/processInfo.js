const activeWin = require('active-win');
const gkm = require('gkm');

let pid = 0;

module.exports = {
  getActiveWindowInfo: function() {
    gkm.events.on('mouse.clicked', function(data) {
      activeWin().then(res => {
        if(pid !== res.pid){
          // for (let k in res){
          //   console.log(k,": ",res[k]);
          // }
          console.log(res.app);
          pid = res.pid;
        }
      });
    });
  }
}

const activeWin = require('active-win');
const gkm = require('gkm');
const moment = require('moment');
const database = require('./database');

module.exports = {
  processname: null,
  started: moment().format('LTS'),
  ended: null,
  currentProcess: {},
  getActiveWindowInfo: function() {
    let self = this;
    gkm.events.on('mouse.clicked', (err, data) => {
      activeWin().then((res) => {
        self.insertProcessTitle(res);
        self.insertActiveProcess(res);
      });
    });
  },

  insertProcessTitle: function(res) {
    if (res.title) {
      database.insertProcessTitle(res);
    }
  },

  insertActiveProcess: function(res) {
    if (res.title) {
      if (this.processname !== res.title) {
        this.currentProcess.title = this.processname;
        this.currentProcess.started = this.started;
        this.currentProcess.ended = moment().format('LTS');
        this.processname = res.title;
        this.started = moment().format('LTS');
        this.ended = null;
        console.log(this.currentProcess);
      }
    }
  }
};

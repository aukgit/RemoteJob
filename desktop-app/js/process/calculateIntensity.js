const electron = require('electron');
const uData = (electron.app || electron.remote.app).getPath('userData');
const fs = require('fs');
const path = require('path');

/**
 * initialize the intensity calculator with configuration
 * got from server
 */

const appconfig = JSON.parse(fs.readFileSync(path.join(uData, 'appconfig.json')));
const config = appconfig.intensityConfig;

let maxMouseClick, maxKeypress, perClickIntensity, perKeypressIntensity, combinedClickIntensity, combinedKeypressIntensity;

let initCalcualtor = function initCalcualtor() {
  maxMouseClick = config.onlyMouse.maxClick;
  maxKeypress = config.onlyKeyboard.maxKeypress;
  combinedClickIntensity = config.combinedIntensity.mouse.intensity;
  combinedKeypressIntensity = config.combinedIntensity.keyboard.intensity;
  perClickIntensity = combinedClickIntensity / config.combinedIntensity.mouse.maxClick;
  perKeypressIntensity = combinedKeypressIntensity / config.combinedIntensity.keyboard.maxKeypress;
}

/**
 * calculate intensity with only mouse click
 * maximum intensity = 100%
 */

let clickIntensity = function(totalClick, callback) {
  let intensity = parseInt((totalClick / maxMouseClick)*100);
  if (intensity > config.onlyMouse.intensity) {
    return callback(config.onlyMouse.intensity);
  }
  return callback(intensity);
}

/**
 * calculate intensity with only keyboard keypress
 * maximum intensity = 80%
 */

let keyPressIntensity = function(totalKeypress, callback) {
  let intensity = parseInt((totalKeypress / maxKeypress)*100);
  if (intensity > config.onlyKeyboard.intensity) {
    return callback(config.onlyKeyboard.intensity);
  }
  return callback(intensity);
}

/**
 * intensity with both mouse click and kyeboard keypress
 * mouse click intensity = 80%
 * keypress intensity = 20%
 */

let combinedIntensity = function(totalClick, totalKeypress, callback) {
  let mouseIntensity = parseInt((totalClick * perClickIntensity)),
    keyboardIntensity = parseInt((totalKeypress * perKeypressIntensity)),
    intensity = mouseIntensity + keyboardIntensity;

  if (mouseIntensity > combinedClickIntensity && keyboardIntensity > combinedKeypressIntensity) {

    return callback(combinedClickIntensity + combinedKeypressIntensity);

  } else if (mouseIntensity > combinedClickIntensity && keyboardIntensity < combinedKeypressIntensity) {

    intensity = combinedClickIntensity + keyboardIntensity;
    return callback(intensity);

  } else if (mouseIntensity < combinedClickIntensity && keyboardIntensity > combinedKeypressIntensity) {

    intensity = mouseIntensity + combinedKeypressIntensity;
    return callback(intensity);

  }

  return callback(intensity);
}

/**
 * select only mouse click OR only keypress or both combined
 * if no click > call keyPressIntensity function
 * if no keypress > call clickIntensity function
 * if both click and keypress are combined > call
 * clickAndKeyPressIntensity function
 */

let calcIntensity = function(mouseInfo, callback) {

  initCalcualtor();

  let totalClick = mouseInfo.totalClick,
    totalKeypress = mouseInfo.totalKeypress;

  if (totalClick && totalKeypress) {
    combinedIntensity(totalClick, totalKeypress, callback);
  } else if (totalClick && !totalKeypress) {
    clickIntensity(totalClick, callback);
  } else if (!totalClick && totalKeypress) {
    keyPressIntensity(totalKeypress, callback);
  } else {
    return callback(0);
  }

}

module.exports = {
  calcIntensity
}

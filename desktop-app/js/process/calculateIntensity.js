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
 * Round number with fixed decimal positions
 */

let roundNum = function roundNum(number, position) {
  if (!position) {
    position = 2;
  }
  return Number((number).toFixed(position));
}


/**
 * calculate intensity with only mouse click
 * maximum intensity = 100%
 */

let clickIntensity = function(totalClick, callback) {
  let intensity = roundNum(((totalClick / maxMouseClick)*100),2);
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
  let intensity = roundNum(((totalKeypress / maxKeypress)*100),2);
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
  let mouseIntensity = roundNum((totalClick * perClickIntensity),2),
    keyboardIntensity = roundNum((totalKeypress * perKeypressIntensity),2),
    intensity = roundNum((mouseIntensity + keyboardIntensity),2);

  if (mouseIntensity > combinedClickIntensity && keyboardIntensity > combinedKeypressIntensity) {

    intensity = roundNum((combinedClickIntensity + combinedKeypressIntensity),2);
    return callback(intensity);

  } else if (mouseIntensity > combinedClickIntensity && keyboardIntensity < combinedKeypressIntensity) {

    intensity = roundNum((combinedClickIntensity + keyboardIntensity),2);
    return callback(intensity);

  } else if (mouseIntensity < combinedClickIntensity && keyboardIntensity > combinedKeypressIntensity) {

    intensity = roundNum((mouseIntensity + combinedKeypressIntensity),2);
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

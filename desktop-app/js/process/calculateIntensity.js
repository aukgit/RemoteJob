const maxMouseClick = 300;
const maxKeypress = 200;
const maxMouseClickCombined = 200;
const maxKeypressCombined = 100;

/**
 * calculate intensity with only mouse click
 * maximum intensity = 100%
 */

let clickIntensity = function(click, callback) {
  let intensity = 0;

  if (click > maxMouseClick) {
    intensity = 100;
  } else {
    intensity = (click / maxMouseClick).toFixed(2);
  }
  return callback(intensity);

}

/**
 * calculate intensity with only keyboard keypress
 * maximum intensity = 80%
 */

let keyPressIntensity = function(keypress, callback) {
  let intensity = 0;

  if (keypress > maxKeypress) {
    intensity = 60;
  } else {
    intensity = (keypress / maxKeypress).toFixed(2);
  }
  return callback(intensity);

}

/**
 * intensity with both mouse click and kyeboard keypress
 * mouse click intensity = 80%
 * keypress intensity = 20%
 */

let clickAndKeyPressIntensity = function(click, keypress, callback) {
  let intensity = 0;

  if (click > maxMouseClickCombined && keypress > maxKeypressCombined) {
    intensity = 100;
  } else if (click < maxMouseClickCombined && keypress > maxKeypressCombined) {
    intensity = (click / maxMouseClickCombined + 20).toFixed(2);
  } else if (click > maxMouseClickCombined && keypress < maxKeypressCombined) {
    intensity = (keypress / maxKeypressCombined + 80).toFixed(2);
  } else {
    intensity = (click / maxMouseClickCombined + keypress / maxKeypressCombined).toFixed(2);
  }

  return callback(intensity);
}

/**
 * select only mouse click OR only keypress or both combined
 */

let calcIntensity = function(mouseInfo, callback) {

  if (mouseInfo.totalClick && mouseInfo.totalKeypress) {
    clickAndKeyPressIntensity(mouseInfo.totalClick, mouseInfo.totalKeypress, callback);
  } else if (mouseInfo.totalClick && !mouseInfo.totalKeypress) {
    clickIntensity(mouseInfo.totalClick, callback);
  } else if (!mouseInfo.totalClick && mouseInfo.totalKeypress) {
    keyPressIntensity(mouseInfo.totalKeypress, callback);
  } else {
    return callback(0);
  }

}

module.exports = {
  calcIntensity
}

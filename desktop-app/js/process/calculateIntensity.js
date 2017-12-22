const maxMouseClick = 300;
const maxKeypress = 200;
const maxMouseClickCombined = 200;
const maxKeypressCombined = 100;

/**
 * calculate intensity with only mouse click
 * maximum intensity = 100%
 */

let clickIntensity = function(totalClick, callback) {
  let intensity = (totalClick / maxMouseClick).toFixed(2);
  if (intensity > 100) {
    return callback(100);
  }
  return callback(intensity);
}

/**
 * calculate intensity with only keyboard keypress
 * maximum intensity = 80%
 */

let keyPressIntensity = function(totalKeypress, callback) {
  let intensity = (totalKeypress / maxKeypress).toFixed(2);
  if (intensity > 60) {
    return callback(60);
  }
  return callback(intensity);
}

/**
 * intensity with both mouse click and kyeboard keypress
 * mouse click intensity = 80%
 * keypress intensity = 20%
 */

let clickAndKeyPressIntensity = function(totalClick, totalKeypress, callback) {
  let mouseIntensity = (totalClick / maxMouseClickCombined).toFixed(2),
    keyboardIntensity = (totalKeypress / maxKeypressCombined).toFixed(2),
    intensity = (mouseIntensity + keyboardIntensity).toFixed(2);

  if (mouseIntensity > 80 && keyboardIntensity > 20) {
    return callback(100);
  } else if (mouseIntensity > 80 && keyboardIntensity < 20) {
    return callback(80 + keyboardIntensity);
  } else if (mouseIntensity < 80 && keyboardIntensity > 20) {
    return callback(mouseIntensity + 20);
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
  let totalClick = mouseInfo.totalClick,
  totalKeypress = mouseInfo.totalKeypress;

  if (totalClick && totalKeypress) {
    clickAndKeyPressIntensity(totalClick, totalKeypress, callback);
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

const maxMouseClick = 300;
const maxKeypress = 200;
const perClickIntensity = 0.8/200;
const perKeypressIntensity = 0.2/100;

/**
 * calculate intensity with only mouse click
 * maximum intensity = 100% > 1
 */

let clickIntensity = function(totalClick, callback) {
  let intensity = Number((totalClick / maxMouseClick).toFixed(2));
  if (intensity > 1) {
    return callback(1);
  }
  return callback(intensity);
}

/**
 * calculate intensity with only keyboard keypress
 * maximum intensity = 80% > 0.8
 */

let keyPressIntensity = function(totalKeypress, callback) {
  let intensity = Number((totalKeypress / maxKeypress).toFixed(2));
  if (intensity > 0.6) {
    return callback(0.6);
  }
  return callback(intensity);
}

/**
 * intensity with both mouse click and kyeboard keypress
 * mouse click intensity = 80% > 0.8
 * keypress intensity = 20% > 0.2
 */

let combinedIntensity = function(totalClick, totalKeypress, callback) {
  let mouseIntensity = Number((totalClick * perClickIntensity).toFixed(2)),
    keyboardIntensity = Number((totalKeypress * perKeypressIntensity).toFixed(2)),
    intensity = Number((mouseIntensity + keyboardIntensity).toFixed(2));

  if (mouseIntensity > 0.8 && keyboardIntensity > 0.2) {

    return callback(1);

  } else if (mouseIntensity > 0.8 && keyboardIntensity < 0.2) {

    intensity = Number((0.8 + keyboardIntensity).toFixed(2));
    return callback(intensity);

  } else if (mouseIntensity < 0.8 && keyboardIntensity > 0.2) {

    intensity = Number((mouseIntensity + 0.2).toFixed(2));
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

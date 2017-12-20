const mci = 0.33;
const kbpi = 0.20;
const mkci = 0.40;
const mkkbpi = 0.20;

let clickIntensity = function (click, fn) {
  let i = 0;
  if(click > 300){
    i = 100;
  } else {
      i = (click*mci).toFixed(2);
  }
  return fn(i);
}

let keyPressIntensity = function (kbp, fn) {
  let i = 0;
  if(kbp > 300){
    i = 60;
  } else {
    i = (kbpi*kbp).toFixed(2);
  }
  return fn(i);
}

let clickAndKeyPressIntensity = function (click, kbp, fn) {
  let i = 0;
  if(click > 200 && kbp > 100){
    i = 100;
  } else if (click < 200 && kbp > 100) {
    i = (click*mkci + 20).toFixed(2);
  } else if (click > 200 && kbp < 100) {
    i = (kbp*mkkbpi + 80).toFixed(2);
  } else {
    i = (kbp*mkkbpi + click*mkci).toFixed(2);
  }
  return fn(i);
}

let calcIntensity = function (data, fn) {
  if(data.totalClick && data.totalKeypress){
    clickAndKeyPressIntensity(data.totalClick, data.totalKeypress, fn);
  } else if (data.totalClick && !data.totalKeypress) {
    clickIntensity(data.totalClick, fn);
  } else if (!data.totalClick && data.totalKeypress) {
    keyPressIntensity(data.totalKeypress, fn);
  } else {
    return 0;
  }
}

module.exports = {
  calcIntensity
}

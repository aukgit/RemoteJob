const crypto = require('crypto');
const fs = require('fs');

let decrypt = function () {
  let input = fs.createReadStream('./061117_0503_data.db.xz'),
      output = fs.createWriteStream('./data.db.xz'),
      encrypt = crypto.createDecipher("aes-256-ctr","This is a secret key");
      input.pipe(encrypt).pipe(output);
}

decrypt();

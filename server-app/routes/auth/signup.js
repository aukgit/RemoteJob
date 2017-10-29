const { check, validationResult } = require('express-validator/check');
const { matchedData } = require('express-validator/filter');
const router = require('express').Router();
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup',[
  check('name','Unnamed not allowed').isLength({min:1}),
  check('username','Username needed').isLength({min:1}),
  check('email','email needed').isLength({min:1}),
  check('password','password must be 6 char long').isLength({min:6}),
], (req, res, next) => {
  let errors = validationResult(req);
  if(errors.isEmpty()){
    let user = matchedData(req);
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
      if(!err){
        user.password = hash;
        User.create(user).catch((err) => {
          console.log(err);
        });
      }
    });
  } else {
    res.render('auth/signup',{errors: errors.array()});
  }
  res.redirect('/');
});

module.exports = router;

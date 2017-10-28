const router = require('express').Router();
const User = require('../../models/User');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  let name = req.body.name,
      username = req.body.username,
      email = req.body.email,
      password = req.body.password;

  User.create({
    name: name,
    username: username,
    email: email,
    password: password
  });

  res.end();

});

module.exports = router;

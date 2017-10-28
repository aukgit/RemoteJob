require('dotenv').config();
const path = require('path');
const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extented: false }));

app.use('/static',express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/', (req, res, next) => {
  res.render('index');
  next();
});


//app.use('/api', require('./routes/api/config'));
app.use('/auth', require('./routes/auth/signup'));

app.listen(process.env.PORT || 8000, () => {
  db.sync();
  console.log(`Listening for req on port ${process.env.PORT}`);
});

const Sequelize = require('sequelize');
const db = require('../db');


let User = db.define('user', {
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    }
  },
  username: {
    type: Sequelize.STRING(15),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Username cannot be empty'
      }
    }
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Email cannot be empty'
      }
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password cannot be empty'
      }
    }
  }
});

module.exports = User;

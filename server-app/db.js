require('dotenv').config();
const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

module.exports = db;

const User = require('./models/User');

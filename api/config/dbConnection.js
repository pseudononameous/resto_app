/**
 * dbConnection.js
 * @description :: database connection using sequelize
 */

const { Sequelize } = require('sequelize');
const dbConfig = require('./db');

let sequelize;

if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage || dbConfig.DB,
    logging: false,
  });
} else {
  sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
  });
}

module.exports = sequelize;

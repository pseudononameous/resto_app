/**
 * db.js
 * @description :: exports values used to make connection with SQL database
 */

const path = require('path');

if (process.env.NODE_ENV !== 'test') {
  module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USER: process.env.DB_USERNAME || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DB: process.env.DB_NAME || 'resto_app',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    storage: process.env.DB_STORAGE || path.join(__dirname, '../data/resto_app.sqlite'),
  };
} else {
  module.exports = {
    HOST: process.env.TEST_DB_HOST || 'localhost',
    USER: process.env.TEST_DB_USERNAME || 'root',
    PASSWORD: process.env.TEST_DB_PASSWORD || '',
    DB: process.env.TEST_DB_NAME || 'resto_app_test',
    dialect: process.env.TEST_DB_DIALECT || 'mysql',
    port: process.env.TEST_DB_PORT || 3306,
    storage: process.env.TEST_DB_STORAGE || ':memory:',
  };
}

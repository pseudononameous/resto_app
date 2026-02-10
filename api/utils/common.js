/**
 * common.js
 * @description :: exports helper methods for project.
 */

const { Op } = require('sequelize');
const dbService = require('./dbService');

function convertObjectToEnum(obj) {
  return Object.values(obj || {});
}

function randomNumber(length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
}

module.exports = {
  convertObjectToEnum,
  randomNumber,
  Op,
};

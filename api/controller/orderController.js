/**
 * orderController.js - Ordering Service
 */
const createCrudController = require('./crudController');
const Order = require('../model/Order');
const schemaKey = require('../utils/validation/orderValidation');

module.exports = createCrudController(Order, schemaKey);

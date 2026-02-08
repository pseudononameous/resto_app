/**
 * orderItemController.js - Ordering Service
 */
const createCrudController = require('./crudController');
const OrderItem = require('../model/OrderItem');
const schemaKey = require('../utils/validation/orderItemValidation');

module.exports = createCrudController(OrderItem, schemaKey);

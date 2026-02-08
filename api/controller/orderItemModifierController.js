/**
 * orderItemModifierController.js - Ordering Service
 */
const createCrudController = require('./crudController');
const OrderItemModifier = require('../model/OrderItemModifier');
const schemaKey = require('../utils/validation/orderItemModifierValidation');

module.exports = createCrudController(OrderItemModifier, schemaKey);

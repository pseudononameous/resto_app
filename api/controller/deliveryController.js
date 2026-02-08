/**
 * deliveryController.js - Delivery Management Service
 */
const createCrudController = require('./crudController');
const Delivery = require('../model/Delivery');
const schemaKey = require('../utils/validation/deliveryValidation');

module.exports = createCrudController(Delivery, schemaKey);

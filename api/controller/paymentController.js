/**
 * paymentController.js - Payment & Billing Service
 */
const createCrudController = require('./crudController');
const Payment = require('../model/Payment');
const schemaKey = require('../utils/validation/paymentValidation');

module.exports = createCrudController(Payment, schemaKey);

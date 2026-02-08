/**
 * refundController.js - Payment & Billing Service
 */
const createCrudController = require('./crudController');
const Refund = require('../model/Refund');
const schemaKey = require('../utils/validation/refundValidation');

module.exports = createCrudController(Refund, schemaKey);

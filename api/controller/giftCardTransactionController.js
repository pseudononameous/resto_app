/**
 * giftCardTransactionController.js - Gift Card Service
 */
const createCrudController = require('./crudController');
const GiftCardTransaction = require('../model/GiftCardTransaction');
const schemaKey = require('../utils/validation/giftCardTransactionValidation');

module.exports = createCrudController(GiftCardTransaction, schemaKey);

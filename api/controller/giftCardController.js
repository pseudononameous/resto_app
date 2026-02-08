/**
 * giftCardController.js - Gift Card Service
 */
const createCrudController = require('./crudController');
const GiftCard = require('../model/GiftCard');
const schemaKey = require('../utils/validation/giftCardValidation');

module.exports = createCrudController(GiftCard, schemaKey);

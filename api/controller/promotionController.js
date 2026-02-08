/**
 * promotionController.js - Promotions & Offers Service
 */
const createCrudController = require('./crudController');
const Promotion = require('../model/Promotion');
const schemaKey = require('../utils/validation/promotionValidation');

module.exports = createCrudController(Promotion, schemaKey);

/**
 * promotionRedemptionController.js - Promotions & Offers Service
 */
const createCrudController = require('./crudController');
const PromotionRedemption = require('../model/PromotionRedemption');
const schemaKey = require('../utils/validation/promotionRedemptionValidation');

module.exports = createCrudController(PromotionRedemption, schemaKey);

/**
 * loyaltyAccountController.js - Loyalty & Rewards Service
 */
const createCrudController = require('./crudController');
const LoyaltyAccount = require('../model/LoyaltyAccount');
const schemaKey = require('../utils/validation/loyaltyAccountValidation');

module.exports = createCrudController(LoyaltyAccount, schemaKey);

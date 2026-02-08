/**
 * rewardController.js - Loyalty & Rewards Service
 */
const createCrudController = require('./crudController');
const Reward = require('../model/Reward');
const schemaKey = require('../utils/validation/rewardValidation');

module.exports = createCrudController(Reward, schemaKey);

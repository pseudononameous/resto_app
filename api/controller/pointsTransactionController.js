/**
 * pointsTransactionController.js - Loyalty & Rewards Service
 */
const createCrudController = require('./crudController');
const PointsTransaction = require('../model/PointsTransaction');
const schemaKey = require('../utils/validation/pointsTransactionValidation');

module.exports = createCrudController(PointsTransaction, schemaKey);

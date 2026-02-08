/**
 * modifierGroupController.js - Product Catalog Service
 */
const createCrudController = require('./crudController');
const ModifierGroup = require('../model/ModifierGroup');
const schemaKey = require('../utils/validation/modifierGroupValidation');

module.exports = createCrudController(ModifierGroup, schemaKey);

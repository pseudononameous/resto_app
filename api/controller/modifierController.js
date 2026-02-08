/**
 * modifierController.js - Product Catalog Service
 */
const createCrudController = require('./crudController');
const Modifier = require('../model/Modifier');
const schemaKey = require('../utils/validation/modifierValidation');

module.exports = createCrudController(Modifier, schemaKey);

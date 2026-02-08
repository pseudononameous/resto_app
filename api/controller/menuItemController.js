/**
 * menuItemController.js - Menu Service
 */
const createCrudController = require('./crudController');
const MenuItem = require('../model/MenuItem');
const schemaKey = require('../utils/validation/menuItemValidation');

module.exports = createCrudController(MenuItem, schemaKey);

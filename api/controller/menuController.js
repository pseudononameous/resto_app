/**
 * menuController.js - Menu Service
 */
const createCrudController = require('./crudController');
const Menu = require('../model/Menu');
const schemaKey = require('../utils/validation/menuValidation');

module.exports = createCrudController(Menu, schemaKey);

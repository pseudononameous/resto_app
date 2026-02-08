/**
 * categoryController.js - Product Catalog Service
 */
const createCrudController = require('./crudController');
const Category = require('../model/Category');
const schemaKey = require('../utils/validation/categoryValidation');

module.exports = createCrudController(Category, schemaKey);

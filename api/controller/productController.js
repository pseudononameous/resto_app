/**
 * productController.js - Product Catalog Service
 */
const createCrudController = require('./crudController');
const Product = require('../model/Product');
const schemaKey = require('../utils/validation/productValidation');

module.exports = createCrudController(Product, schemaKey);

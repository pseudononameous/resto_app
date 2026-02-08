/**
 * productRecipeController.js - Inventory Service
 */
const createCrudController = require('./crudController');
const ProductRecipe = require('../model/ProductRecipe');
const schemaKey = require('../utils/validation/productRecipeValidation');

module.exports = createCrudController(ProductRecipe, schemaKey);

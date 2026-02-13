const createCrudController = require('./crudController');
const ProductModifierGroup = require('../model/ProductModifierGroup');
const schemaKey = require('../utils/validation/productModifierGroupValidation');

module.exports = createCrudController(ProductModifierGroup, schemaKey);

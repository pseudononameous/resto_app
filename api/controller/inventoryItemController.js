/**
 * inventoryItemController.js - Inventory Service
 */
const createCrudController = require('./crudController');
const InventoryItem = require('../model/InventoryItem');
const schemaKey = require('../utils/validation/inventoryItemValidation');

module.exports = createCrudController(InventoryItem, schemaKey);

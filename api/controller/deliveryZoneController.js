const createCrudController = require('./crudController');
const DeliveryZone = require('../model/DeliveryZone');
const schemaKey = require('../utils/validation/deliveryZoneValidation');

module.exports = createCrudController(DeliveryZone, schemaKey);

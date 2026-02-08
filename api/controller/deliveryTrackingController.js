/**
 * deliveryTrackingController.js - Delivery Management Service
 */
const createCrudController = require('./crudController');
const DeliveryTracking = require('../model/DeliveryTracking');
const schemaKey = require('../utils/validation/deliveryTrackingValidation');

module.exports = createCrudController(DeliveryTracking, schemaKey);

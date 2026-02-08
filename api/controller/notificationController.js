/**
 * notificationController.js - Notification Service
 */
const createCrudController = require('./crudController');
const Notification = require('../model/Notification');
const schemaKey = require('../utils/validation/notificationValidation');

module.exports = createCrudController(Notification, schemaKey);

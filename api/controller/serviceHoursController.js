const createCrudController = require('./crudController');
const ServiceHours = require('../model/ServiceHours');
const schemaKey = require('../utils/validation/serviceHoursValidation');

module.exports = createCrudController(ServiceHours, schemaKey);

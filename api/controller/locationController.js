const createCrudController = require('./crudController');
const Location = require('../model/Location');
const schemaKey = require('../utils/validation/locationValidation');

module.exports = createCrudController(Location, schemaKey);

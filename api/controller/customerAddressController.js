const createCrudController = require('./crudController');
const CustomerAddress = require('../model/CustomerAddress');
const schemaKey = require('../utils/validation/customerAddressValidation');

module.exports = createCrudController(CustomerAddress, schemaKey);

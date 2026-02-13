const createCrudController = require('./crudController');
const Reservation = require('../model/Reservation');
const schemaKey = require('../utils/validation/reservationValidation');

module.exports = createCrudController(Reservation, schemaKey);

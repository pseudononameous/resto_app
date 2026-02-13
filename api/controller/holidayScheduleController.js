const createCrudController = require('./crudController');
const HolidaySchedule = require('../model/HolidaySchedule');
const schemaKey = require('../utils/validation/holidayScheduleValidation');

module.exports = createCrudController(HolidaySchedule, schemaKey);

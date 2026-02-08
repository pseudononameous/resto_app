/**
 * userController.js - Identity & Access Service
 */
const createCrudController = require('./crudController');
const User = require('../model/User');
const schemaKey = require('../utils/validation/userValidation');

module.exports = createCrudController(User, schemaKey);

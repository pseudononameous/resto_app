/**
 * rolePermissionController.js - Identity & Access Service
 */
const createCrudController = require('./crudController');
const RolePermission = require('../model/RolePermission');
const schemaKey = require('../utils/validation/rolePermissionValidation');

module.exports = createCrudController(RolePermission, schemaKey);

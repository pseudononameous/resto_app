/**
 * rolePermissionValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  role: joi.string().required(),
  permissions: joi.array().items(joi.string()).allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  role: joi.string().allow(null),
  permissions: joi.array().items(joi.string()).allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  role: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  permissions: joi.any(),
  createdAt: joi.any(),
  updatedAt: joi.any(),
}).unknown(true);

exports.findFilterKeys = joi.object({
  options: options,
  query: filterKeys,
  where: filterKeys,
  isCountOnly: isCountOnly,
  include: joi.array().items(include),
  select: select,
}).unknown(true);

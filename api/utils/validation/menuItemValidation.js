/**
 * menuItemValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  menuId: joi.number().integer().required(),
  productId: joi.number().integer().required(),
  displayPrice: joi.number().min(0).allow(null),
  availabilityStatus: joi.string().allow(null).allow(''),
  stockControlled: joi.boolean().default(false),
  sortOrder: joi.number().integer().default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  menuId: joi.number().integer().allow(null),
  productId: joi.number().integer().allow(null),
  displayPrice: joi.number().min(0).allow(null),
  availabilityStatus: joi.string().allow(null).allow(''),
  stockControlled: joi.boolean().allow(null),
  sortOrder: joi.number().integer().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  menuId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  productId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  displayPrice: joi.any(),
  availabilityStatus: joi.any(),
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

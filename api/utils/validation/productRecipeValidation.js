/**
 * productRecipeValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  productId: joi.number().integer().required(),
  inventoryId: joi.number().integer().required(),
  quantityRequired: joi.number().min(0).default(1),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  productId: joi.number().integer().allow(null),
  inventoryId: joi.number().integer().allow(null),
  quantityRequired: joi.number().min(0).allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  productId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  inventoryId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  quantityRequired: joi.any(),
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

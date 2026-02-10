/**
 * inventoryItemValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().required(),
  unit: joi.string().required(),
  quantityOnHand: joi.number().min(0).default(0),
  reorderLevel: joi.number().min(0).allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null),
  unit: joi.string().allow(null),
  quantityOnHand: joi.number().min(0).allow(null),
  reorderLevel: joi.number().min(0).allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  unit: joi.any(),
  quantityOnHand: joi.any(),
  reorderLevel: joi.any(),
  lastUpdated: joi.any(),
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

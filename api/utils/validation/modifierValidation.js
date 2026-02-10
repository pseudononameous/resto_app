/**
 * modifierValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  modifierGroupId: joi.number().integer().required(),
  name: joi.string().required(),
  priceDelta: joi.number().default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  modifierGroupId: joi.number().integer().allow(null),
  name: joi.string().allow(null),
  priceDelta: joi.number().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  modifierGroupId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  priceDelta: joi.any(),
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

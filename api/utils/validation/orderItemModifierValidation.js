/**
 * orderItemModifierValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  orderItemId: joi.number().integer().required(),
  modifierId: joi.number().integer().required(),
  priceDelta: joi.number().default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  orderItemId: joi.number().integer().allow(null),
  modifierId: joi.number().integer().allow(null),
  priceDelta: joi.number().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  orderItemId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  modifierId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
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

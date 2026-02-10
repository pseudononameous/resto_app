/**
 * promotionRedemptionValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  promotionId: joi.number().integer().required(),
  orderId: joi.number().integer().required(),
  customerId: joi.number().integer().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  promotionId: joi.number().integer().allow(null),
  orderId: joi.number().integer().allow(null),
  customerId: joi.number().integer().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  promotionId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  orderId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  customerId: joi.any(),
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

/**
 * pointsTransactionValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  customerId: joi.number().integer().required(),
  points: joi.number().integer().required(),
  type: joi.string().valid('earned', 'redeemed').required(),
  referenceOrderId: joi.number().integer().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  customerId: joi.number().integer().allow(null),
  points: joi.number().integer().allow(null),
  type: joi.string().valid('earned', 'redeemed').allow(null),
  referenceOrderId: joi.number().integer().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  customerId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  points: joi.any(),
  type: joi.any(),
  referenceOrderId: joi.any(),
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

/**
 * giftCardTransactionValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  cardId: joi.number().integer().required(),
  amount: joi.number().required(),
  type: joi.string().valid('issued', 'redeemed').required(),
  referenceOrderId: joi.number().integer().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  cardId: joi.number().integer().allow(null),
  amount: joi.number().allow(null),
  type: joi.string().valid('issued', 'redeemed').allow(null),
  referenceOrderId: joi.number().integer().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  cardId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  amount: joi.any(),
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

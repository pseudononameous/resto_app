/**
 * paymentValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  orderId: joi.number().integer().required(),
  paymentMethod: joi.string().valid('card', 'gift_card', 'loyalty_points').required(),
  amount: joi.number().min(0).required(),
  status: joi.string().allow(null).allow(''),
  transactionReference: joi.string().allow(null).allow(''),
  paidAt: joi.date().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  orderId: joi.number().integer().allow(null),
  paymentMethod: joi.string().valid('card', 'gift_card', 'loyalty_points').allow(null),
  amount: joi.number().min(0).allow(null),
  status: joi.string().allow(null).allow(''),
  transactionReference: joi.string().allow(null).allow(''),
  paidAt: joi.date().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  orderId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  paymentMethod: joi.any(),
  amount: joi.any(),
  status: joi.any(),
  transactionReference: joi.any(),
  paidAt: joi.any(),
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

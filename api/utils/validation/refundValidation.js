/**
 * refundValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  paymentId: joi.number().integer().required(),
  amount: joi.number().min(0).required(),
  reason: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  paymentId: joi.number().integer().allow(null),
  amount: joi.number().min(0).allow(null),
  reason: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  paymentId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  amount: joi.any(),
  reason: joi.any(),
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

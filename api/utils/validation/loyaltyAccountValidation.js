/**
 * loyaltyAccountValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  customerId: joi.number().integer().required(),
  pointsBalance: joi.number().integer().min(0).default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  customerId: joi.number().integer().allow(null),
  pointsBalance: joi.number().integer().min(0).allow(null),
}).unknown(true);

const filterKeys = joi.object({
  customerId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  pointsBalance: joi.any(),
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

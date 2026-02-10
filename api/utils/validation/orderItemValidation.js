/**
 * orderItemValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  orderId: joi.number().integer().required(),
  productId: joi.number().integer().required(),
  quantity: joi.number().integer().min(1).default(1),
  unitPrice: joi.number().min(0).default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  orderId: joi.number().integer().allow(null),
  productId: joi.number().integer().allow(null),
  quantity: joi.number().integer().min(1).allow(null),
  unitPrice: joi.number().min(0).allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  orderId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  productId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  quantity: joi.any(),
  unitPrice: joi.any(),
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

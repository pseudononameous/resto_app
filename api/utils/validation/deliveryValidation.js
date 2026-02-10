/**
 * deliveryValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  orderId: joi.number().integer().required(),
  providerId: joi.number().integer().allow(null),
  deliveryStatus: joi.string().allow(null).allow(''),
  pickupTime: joi.date().allow(null),
  deliveredTime: joi.date().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  orderId: joi.number().integer().allow(null),
  providerId: joi.number().integer().allow(null),
  deliveryStatus: joi.string().allow(null).allow(''),
  pickupTime: joi.date().allow(null),
  deliveredTime: joi.date().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  orderId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  providerId: joi.any(),
  deliveryStatus: joi.any(),
  pickupTime: joi.any(),
  deliveredTime: joi.any(),
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

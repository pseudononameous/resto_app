/**
 * deliveryTrackingValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  deliveryId: joi.number().integer().required(),
  latitude: joi.number().allow(null),
  longitude: joi.number().allow(null),
  timestamp: joi.date().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  deliveryId: joi.number().integer().allow(null),
  latitude: joi.number().allow(null),
  longitude: joi.number().allow(null),
  timestamp: joi.date().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  deliveryId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  latitude: joi.any(),
  longitude: joi.any(),
  timestamp: joi.any(),
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

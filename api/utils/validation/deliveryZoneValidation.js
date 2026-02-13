const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  locationId: joi.number().integer().required(),
  name: joi.string().required(),
  minDistanceKm: joi.number().allow(null),
  maxDistanceKm: joi.number().allow(null),
  deliveryFee: joi.number().min(0).default(0),
  minOrderAmount: joi.number().allow(null),
  activeFlag: joi.boolean().default(true),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  locationId: joi.number().integer().allow(null),
  name: joi.string().allow(null),
  minDistanceKm: joi.number().allow(null),
  maxDistanceKm: joi.number().allow(null),
  deliveryFee: joi.number().min(0).allow(null),
  minOrderAmount: joi.number().allow(null),
  activeFlag: joi.boolean().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  locationId: joi.any(),
  activeFlag: joi.any(),
  createdAt: joi.any(),
  updatedAt: joi.any(),
}).unknown(true);

exports.findFilterKeys = joi.object({
  options,
  query: filterKeys,
  where: filterKeys,
  isCountOnly,
  include: joi.array().items(include),
  select,
}).unknown(true);

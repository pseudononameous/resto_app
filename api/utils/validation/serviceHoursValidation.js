const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  locationId: joi.number().integer().required(),
  dayOfWeek: joi.number().integer().min(0).max(6).required(),
  openTime: joi.string().allow(null).allow(''),
  closeTime: joi.string().allow(null).allow(''),
  isClosed: joi.boolean().default(false),
  serviceType: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  locationId: joi.number().integer().allow(null),
  dayOfWeek: joi.number().integer().min(0).max(6).allow(null),
  openTime: joi.string().allow(null).allow(''),
  closeTime: joi.string().allow(null).allow(''),
  isClosed: joi.boolean().allow(null),
  serviceType: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  locationId: joi.any(),
  dayOfWeek: joi.any(),
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

const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  userId: joi.number().integer().required(),
  label: joi.string().allow(null).allow(''),
  addressLine1: joi.string().required(),
  addressLine2: joi.string().allow(null).allow(''),
  city: joi.string().required(),
  state: joi.string().allow(null).allow(''),
  zipCode: joi.string().required(),
  country: joi.string().allow(null).allow(''),
  isDefault: joi.boolean().default(false),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  userId: joi.number().integer().allow(null),
  label: joi.string().allow(null).allow(''),
  addressLine1: joi.string().allow(null),
  addressLine2: joi.string().allow(null).allow(''),
  city: joi.string().allow(null),
  state: joi.string().allow(null).allow(''),
  zipCode: joi.string().allow(null),
  country: joi.string().allow(null).allow(''),
  isDefault: joi.boolean().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  userId: joi.any(),
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

const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().required(),
  address: joi.string().allow(null).allow(''),
  city: joi.string().allow(null).allow(''),
  state: joi.string().allow(null).allow(''),
  zipCode: joi.string().allow(null).allow(''),
  country: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  latitude: joi.number().allow(null),
  longitude: joi.number().allow(null),
  activeFlag: joi.boolean().default(true),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null),
  address: joi.string().allow(null).allow(''),
  city: joi.string().allow(null).allow(''),
  state: joi.string().allow(null).allow(''),
  zipCode: joi.string().allow(null).allow(''),
  country: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  latitude: joi.number().allow(null),
  longitude: joi.number().allow(null),
  activeFlag: joi.boolean().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.any(),
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

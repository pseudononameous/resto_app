/**
 * userValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  role: joi.string().allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  phone: joi.string().allow(null).allow(''),
  role: joi.string().allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  email: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  phone: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  role: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  status: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
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

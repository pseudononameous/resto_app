/**
 * productValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().required(),
  description: joi.string().allow(null).allow(''),
  basePrice: joi.number().min(0).required(),
  categoryId: joi.number().integer().allow(null),
  activeFlag: joi.boolean().default(true),
  imageUrl: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null),
  description: joi.string().allow(null).allow(''),
  basePrice: joi.number().min(0).allow(null),
  categoryId: joi.number().integer().allow(null),
  activeFlag: joi.boolean().allow(null),
  imageUrl: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  description: joi.any(),
  basePrice: joi.any(),
  categoryId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  activeFlag: joi.alternatives().try(joi.array().items(), joi.boolean(), joi.object()),
  imageUrl: joi.any(),
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

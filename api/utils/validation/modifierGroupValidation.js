/**
 * modifierGroupValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().required(),
  selectionType: joi.string().valid('single', 'multiple').required(),
  requiredFlag: joi.boolean().default(false),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null),
  selectionType: joi.string().valid('single', 'multiple').allow(null),
  requiredFlag: joi.boolean().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  selectionType: joi.any(),
  requiredFlag: joi.alternatives().try(joi.array().items(), joi.boolean(), joi.object()),
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

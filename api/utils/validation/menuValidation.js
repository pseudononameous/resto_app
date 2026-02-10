/**
 * menuValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  name: joi.string().required(),
  activeFlag: joi.boolean().default(true),
  scheduleRules: joi.object().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null),
  activeFlag: joi.boolean().allow(null),
  scheduleRules: joi.object().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  name: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()),
  activeFlag: joi.alternatives().try(joi.array().items(), joi.boolean(), joi.object()),
  scheduleRules: joi.any(),
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

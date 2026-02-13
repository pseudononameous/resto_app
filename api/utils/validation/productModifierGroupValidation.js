const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  productId: joi.number().integer().required(),
  modifierGroupId: joi.number().integer().required(),
  sortOrder: joi.number().integer().default(0),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  productId: joi.number().integer().allow(null),
  modifierGroupId: joi.number().integer().allow(null),
  sortOrder: joi.number().integer().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  productId: joi.any(),
  modifierGroupId: joi.any(),
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

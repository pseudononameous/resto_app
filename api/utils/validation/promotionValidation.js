/**
 * promotionValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  title: joi.string().required(),
  discountType: joi.string().valid('percent', 'fixed').required(),
  discountValue: joi.number().min(0).required(),
  startDate: joi.date().allow(null),
  endDate: joi.date().allow(null),
  conditionsJson: joi.object().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  title: joi.string().allow(null),
  discountType: joi.string().valid('percent', 'fixed').allow(null),
  discountValue: joi.number().min(0).allow(null),
  startDate: joi.date().allow(null),
  endDate: joi.date().allow(null),
  conditionsJson: joi.object().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  title: joi.any(),
  discountType: joi.any(),
  discountValue: joi.any(),
  startDate: joi.any(),
  endDate: joi.any(),
  conditionsJson: joi.any(),
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

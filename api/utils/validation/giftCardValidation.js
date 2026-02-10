/**
 * giftCardValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  code: joi.string().required(),
  balance: joi.number().min(0).default(0),
  status: joi.string().allow(null).allow(''),
  expirationDate: joi.date().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  code: joi.string().allow(null),
  balance: joi.number().min(0).allow(null),
  status: joi.string().allow(null).allow(''),
  expirationDate: joi.date().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  code: joi.any(),
  balance: joi.any(),
  status: joi.any(),
  expirationDate: joi.any(),
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

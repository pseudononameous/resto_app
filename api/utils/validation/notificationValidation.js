/**
 * notificationValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  userId: joi.number().integer().required(),
  type: joi.string().allow(null).allow(''),
  channel: joi.string().allow(null).allow(''),
  message: joi.string().allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
  sentAt: joi.date().allow(null),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  userId: joi.number().integer().allow(null),
  type: joi.string().allow(null).allow(''),
  channel: joi.string().allow(null).allow(''),
  message: joi.string().allow(null).allow(''),
  status: joi.string().allow(null).allow(''),
  sentAt: joi.date().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  userId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  type: joi.any(),
  channel: joi.any(),
  message: joi.any(),
  status: joi.any(),
  sentAt: joi.any(),
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

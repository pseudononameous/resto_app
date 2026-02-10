/**
 * commonFilterValidation.js
 * @description :: helper to validate filter.
 */

const joi = require('joi');

exports.options = joi.object({
  pagination: joi.boolean(),
  collation: joi.alternatives().try(joi.string(), joi.object()).allow(null).allow(''),
  sort: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()).allow(null).allow(''),
  populate: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()).allow(null).allow(''),
  projection: joi.alternatives().try(joi.array().items(), joi.string(), joi.object()).allow(null).allow(''),
  lean: joi.boolean(),
  leanWithId: joi.boolean(),
  page: joi.number().integer(),
  limit: joi.number(),
  paginate: joi.number(),
  useEstimatedCount: joi.boolean(),
  useCustomCountFn: joi.boolean(),
  forceCountFn: joi.boolean(),
  read: joi.any(),
  options: joi.any(),
}).unknown(true);

exports.isCountOnly = joi.boolean();

exports.include = joi.object({
  path: joi.string().allow(null).allow(''),
  model: joi.string().allow(null).allow(''),
  select: joi.array(),
  attributes: joi.array(),
  as: joi.string().allow(null).allow(''),
  query: joi.object().allow(null),
}).unknown(true);

exports.select = joi.alternatives().try(joi.array().items(), joi.string(), joi.object()).allow(null).allow('');

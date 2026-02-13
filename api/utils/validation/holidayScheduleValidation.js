const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  locationId: joi.number().integer().allow(null),
  name: joi.string().required(),
  holidayDate: joi.date().required(),
  isClosed: joi.boolean().default(true),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  locationId: joi.number().integer().allow(null),
  name: joi.string().allow(null),
  holidayDate: joi.date().allow(null),
  isClosed: joi.boolean().allow(null),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  locationId: joi.any(),
  holidayDate: joi.any(),
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

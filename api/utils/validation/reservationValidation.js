const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  locationId: joi.number().integer().required(),
  customerId: joi.number().integer().allow(null),
  guestName: joi.string().allow(null).allow(''),
  guestEmail: joi.string().allow(null).allow(''),
  guestPhone: joi.string().allow(null).allow(''),
  reservationDate: joi.date().required(),
  startTime: joi.string().required(),
  endTime: joi.string().allow(null).allow(''),
  partySize: joi.number().integer().min(1).default(2),
  status: joi.string().valid('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show').default('pending'),
  notes: joi.string().allow(null).allow(''),
  tableNumber: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  locationId: joi.number().integer().allow(null),
  customerId: joi.number().integer().allow(null),
  guestName: joi.string().allow(null).allow(''),
  guestEmail: joi.string().allow(null).allow(''),
  guestPhone: joi.string().allow(null).allow(''),
  reservationDate: joi.date().allow(null),
  startTime: joi.string().allow(null),
  endTime: joi.string().allow(null).allow(''),
  partySize: joi.number().integer().min(1).allow(null),
  status: joi.string().valid('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show').allow(null),
  notes: joi.string().allow(null).allow(''),
  tableNumber: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  locationId: joi.any(),
  customerId: joi.any(),
  reservationDate: joi.any(),
  status: joi.any(),
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

/**
 * orderValidation.js
 */
const joi = require('joi');
const { options, isCountOnly, include, select } = require('./commonFilterValidation');

exports.schemaKeys = joi.object({
  customerId: joi.number().integer().allow(null),
  locationId: joi.number().integer().allow(null),
  orderType: joi.string().valid('dine_in', 'takeout', 'delivery').required(),
  orderStatus: joi.string().allow(null).allow(''),
  scheduledAt: joi.date().allow(null),
  subtotal: joi.number().min(0).default(0),
  discountAmount: joi.number().min(0).default(0),
  deliveryFee: joi.number().min(0).default(0),
  totalAmount: joi.number().min(0).default(0),
  deliveryZoneId: joi.number().integer().allow(null),
  guestEmail: joi.string().allow(null).allow(''),
  guestName: joi.string().allow(null).allow(''),
  guestPhone: joi.string().allow(null).allow(''),
  notes: joi.string().allow(null).allow(''),
}).unknown(true);

exports.updateSchemaKeys = joi.object({
  customerId: joi.number().integer().allow(null),
  locationId: joi.number().integer().allow(null),
  orderType: joi.string().valid('dine_in', 'takeout', 'delivery').allow(null),
  orderStatus: joi.string().allow(null).allow(''),
  scheduledAt: joi.date().allow(null),
  subtotal: joi.number().min(0).allow(null),
  discountAmount: joi.number().min(0).allow(null),
  deliveryFee: joi.number().min(0).allow(null),
  totalAmount: joi.number().min(0).allow(null),
  deliveryZoneId: joi.number().integer().allow(null),
  guestEmail: joi.string().allow(null).allow(''),
  guestName: joi.string().allow(null).allow(''),
  guestPhone: joi.string().allow(null).allow(''),
  notes: joi.string().allow(null).allow(''),
  id: joi.number().integer(),
}).unknown(true);

const filterKeys = joi.object({
  id: joi.any(),
  customerId: joi.alternatives().try(joi.array().items(), joi.number().integer(), joi.object()),
  orderType: joi.any(),
  orderStatus: joi.any(),
  subtotal: joi.any(),
  discountAmount: joi.any(),
  totalAmount: joi.any(),
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

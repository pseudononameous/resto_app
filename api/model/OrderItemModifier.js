/**
 * OrderItemModifier.js - Ordering Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const OrderItemModifier = sequelize.define('OrderItemModifier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderItemId: { type: DataTypes.INTEGER, allowNull: false },
  modifierId: { type: DataTypes.INTEGER, allowNull: false },
  priceDelta: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'order_item_modifiers', underscored: true });

sequelizePaginate.paginate(OrderItemModifier);
module.exports = OrderItemModifier;

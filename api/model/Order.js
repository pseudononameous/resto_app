/**
 * Order.js - Ordering Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  locationId: { type: DataTypes.INTEGER, allowNull: true },
  orderType: { type: DataTypes.STRING(50), allowNull: false }, // dine_in | takeout | delivery
  orderStatus: { type: DataTypes.STRING(50), allowNull: true }, // pending | confirmed | preparing | ready | out_for_delivery | delivered | completed | cancelled
  scheduledAt: { type: DataTypes.DATE, allowNull: true },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  discountAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  deliveryFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  deliveryZoneId: { type: DataTypes.INTEGER, allowNull: true },
  guestEmail: { type: DataTypes.STRING(255), allowNull: true },
  guestName: { type: DataTypes.STRING(255), allowNull: true },
  guestPhone: { type: DataTypes.STRING(50), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'orders', underscored: true });

sequelizePaginate.paginate(Order);
module.exports = Order;

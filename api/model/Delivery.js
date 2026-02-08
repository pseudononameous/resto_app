/**
 * Delivery.js - Delivery Management Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Delivery = sequelize.define('Delivery', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  providerId: { type: DataTypes.INTEGER, allowNull: true },
  deliveryStatus: { type: DataTypes.STRING(50), allowNull: true },
  pickupTime: { type: DataTypes.DATE, allowNull: true },
  deliveredTime: { type: DataTypes.DATE, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'deliveries', underscored: true });

sequelizePaginate.paginate(Delivery);
module.exports = Delivery;

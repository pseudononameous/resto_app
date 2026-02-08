/**
 * DeliveryTracking.js - Delivery Management Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const DeliveryTracking = sequelize.define('DeliveryTracking', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  deliveryId: { type: DataTypes.INTEGER, allowNull: false },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'delivery_trackings', underscored: true });

sequelizePaginate.paginate(DeliveryTracking);
module.exports = DeliveryTracking;

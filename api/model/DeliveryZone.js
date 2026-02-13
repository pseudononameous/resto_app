/**
 * DeliveryZone.js - Zone-based delivery, distance-based fees
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const DeliveryZone = sequelize.define('DeliveryZone', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  locationId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  minDistanceKm: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
  maxDistanceKm: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
  deliveryFee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  minOrderAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  activeFlag: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'delivery_zones', underscored: true });

sequelizePaginate.paginate(DeliveryZone);
module.exports = DeliveryZone;

/**
 * ServiceHours.js - Service hours & scheduling per location
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const ServiceHours = sequelize.define('ServiceHours', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  locationId: { type: DataTypes.INTEGER, allowNull: false },
  dayOfWeek: { type: DataTypes.INTEGER, allowNull: false }, // 0-6 Sunday-Saturday
  openTime: { type: DataTypes.TIME, allowNull: true },
  closeTime: { type: DataTypes.TIME, allowNull: true },
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: false },
  serviceType: { type: DataTypes.STRING(50), allowNull: true }, // delivery | pickup | dine_in
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'service_hours', underscored: true });

sequelizePaginate.paginate(ServiceHours);
module.exports = ServiceHours;

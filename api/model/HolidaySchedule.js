/**
 * HolidaySchedule.js - Holiday closures
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const HolidaySchedule = sequelize.define('HolidaySchedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  locationId: { type: DataTypes.INTEGER, allowNull: true }, // null = all locations
  name: { type: DataTypes.STRING(255), allowNull: false },
  holidayDate: { type: DataTypes.DATEONLY, allowNull: false },
  isClosed: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'holiday_schedules', underscored: true });

sequelizePaginate.paginate(HolidaySchedule);
module.exports = HolidaySchedule;

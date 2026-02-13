/**
 * Location.js - Multi-location support
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Location = sequelize.define('Location', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: true },
  state: { type: DataTypes.STRING(100), allowNull: true },
  zipCode: { type: DataTypes.STRING(20), allowNull: true },
  country: { type: DataTypes.STRING(100), allowNull: true },
  phone: { type: DataTypes.STRING(50), allowNull: true },
  latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
  activeFlag: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'locations', underscored: true });

sequelizePaginate.paginate(Location);
module.exports = Location;

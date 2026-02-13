/**
 * CustomerAddress.js - Saved addresses for customers
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const CustomerAddress = sequelize.define('CustomerAddress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  label: { type: DataTypes.STRING(100), allowNull: true }, // Home, Work, etc.
  addressLine1: { type: DataTypes.STRING(255), allowNull: false },
  addressLine2: { type: DataTypes.STRING(255), allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: true },
  zipCode: { type: DataTypes.STRING(20), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: true },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'customer_addresses', underscored: true });

sequelizePaginate.paginate(CustomerAddress);
module.exports = CustomerAddress;

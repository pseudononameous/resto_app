/**
 * User.js - Identity & Access Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true },
  passwordHash: { type: DataTypes.STRING(255), allowNull: true },
  role: { type: DataTypes.STRING, allowNull: true }, // customer, staff, admin, delivery_provider
  status: { type: DataTypes.STRING, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'users', underscored: true });

sequelizePaginate.paginate(User);
module.exports = User;

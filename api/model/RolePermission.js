/**
 * RolePermission.js - Identity & Access Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const RolePermission = sequelize.define('RolePermission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  role: { type: DataTypes.STRING, allowNull: false },
  permissions: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }, // array of permission strings
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'role_permissions', underscored: true });

sequelizePaginate.paginate(RolePermission);
module.exports = RolePermission;

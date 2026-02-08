/**
 * Modifier.js - Product Catalog Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Modifier = sequelize.define('Modifier', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modifierGroupId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(255), allowNull: false },
  priceDelta: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'modifiers', underscored: true });

sequelizePaginate.paginate(Modifier);
module.exports = Modifier;

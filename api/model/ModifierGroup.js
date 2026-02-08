/**
 * ModifierGroup.js - Product Catalog Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const ModifierGroup = sequelize.define('ModifierGroup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  selectionType: { type: DataTypes.STRING(50), allowNull: false }, // single | multiple
  requiredFlag: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'modifier_groups', underscored: true });

sequelizePaginate.paginate(ModifierGroup);
module.exports = ModifierGroup;

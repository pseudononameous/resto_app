/**
 * ProductModifierGroup.js - Link product to modifier groups (add-ons/options)
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');

const ProductModifierGroup = sequelize.define('ProductModifierGroup', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  modifierGroupId: { type: DataTypes.INTEGER, allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'product_modifier_groups', underscored: true });

module.exports = ProductModifierGroup;

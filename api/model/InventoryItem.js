/**
 * InventoryItem.js - Inventory Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const InventoryItem = sequelize.define('InventoryItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  unit: { type: DataTypes.STRING(50), allowNull: false },
  quantityOnHand: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0 },
  reorderLevel: { type: DataTypes.DECIMAL(12, 3), allowNull: true },
  lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'inventory_items', underscored: true });

sequelizePaginate.paginate(InventoryItem);
module.exports = InventoryItem;

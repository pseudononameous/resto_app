/**
 * MenuItem.js - Menu Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const MenuItem = sequelize.define('MenuItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  menuId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  displayPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  availabilityStatus: { type: DataTypes.STRING(50), allowNull: true }, // available | out_of_stock | scheduled
  scheduleRules: { type: DataTypes.JSON, allowNull: true }, // time/day availability
  stockControlled: { type: DataTypes.BOOLEAN, defaultValue: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'menu_items', underscored: true });

sequelizePaginate.paginate(MenuItem);
module.exports = MenuItem;

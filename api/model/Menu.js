/**
 * Menu.js - Menu Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Menu = sequelize.define('Menu', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  activeFlag: { type: DataTypes.BOOLEAN, defaultValue: true },
  scheduleRules: { type: DataTypes.JSON, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'menus', underscored: true });

sequelizePaginate.paginate(Menu);
module.exports = Menu;

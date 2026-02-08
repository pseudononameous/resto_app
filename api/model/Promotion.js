/**
 * Promotion.js - Promotions & Offers Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Promotion = sequelize.define('Promotion', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  discountType: { type: DataTypes.STRING(50), allowNull: false }, // percent | fixed
  discountValue: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  startDate: { type: DataTypes.DATE, allowNull: true },
  endDate: { type: DataTypes.DATE, allowNull: true },
  conditionsJson: { type: DataTypes.JSON, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'promotions', underscored: true });

sequelizePaginate.paginate(Promotion);
module.exports = Promotion;

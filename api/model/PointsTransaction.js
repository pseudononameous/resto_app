/**
 * PointsTransaction.js - Loyalty & Rewards Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const PointsTransaction = sequelize.define('PointsTransaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customerId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
  points: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: false }, // earned | redeemed
  referenceOrderId: { type: DataTypes.INTEGER, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'points_transactions', underscored: true });

sequelizePaginate.paginate(PointsTransaction);
module.exports = PointsTransaction;

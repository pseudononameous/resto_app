/**
 * GiftCardTransaction.js - Gift Card Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const GiftCardTransaction = sequelize.define('GiftCardTransaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cardId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  type: { type: DataTypes.STRING(50), allowNull: false }, // issued | redeemed
  referenceOrderId: { type: DataTypes.INTEGER, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'gift_card_transactions', underscored: true });

sequelizePaginate.paginate(GiftCardTransaction);
module.exports = GiftCardTransaction;

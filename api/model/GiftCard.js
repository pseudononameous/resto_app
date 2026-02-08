/**
 * GiftCard.js - Gift Card Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const GiftCard = sequelize.define('GiftCard', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  balance: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING(50), allowNull: true },
  expirationDate: { type: DataTypes.DATEONLY, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'gift_cards', underscored: true });

sequelizePaginate.paginate(GiftCard);
module.exports = GiftCard;

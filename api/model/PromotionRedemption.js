/**
 * PromotionRedemption.js - Promotions & Offers Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const PromotionRedemption = sequelize.define('PromotionRedemption', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  promotionId: { type: DataTypes.INTEGER, allowNull: false },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  customerId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'promotion_redemptions', underscored: true });

sequelizePaginate.paginate(PromotionRedemption);
module.exports = PromotionRedemption;

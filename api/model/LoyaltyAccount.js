/**
 * LoyaltyAccount.js - Loyalty & Rewards Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const LoyaltyAccount = sequelize.define('LoyaltyAccount', {
  customerId: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
  pointsBalance: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'loyalty_accounts', underscored: true });

sequelizePaginate.paginate(LoyaltyAccount);
module.exports = LoyaltyAccount;

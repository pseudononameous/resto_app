/**
 * Reward.js - Loyalty & Rewards Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Reward = sequelize.define('Reward', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  pointsRequired: { type: DataTypes.INTEGER, allowNull: false },
  rewardType: { type: DataTypes.STRING(100), allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'rewards', underscored: true });

sequelizePaginate.paginate(Reward);
module.exports = Reward;

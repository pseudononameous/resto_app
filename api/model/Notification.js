/**
 * Notification.js - Notification Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.STRING(50), allowNull: true }, // order | delivery | promotion
  channel: { type: DataTypes.STRING(50), allowNull: true }, // sms | email | push
  message: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING(50), allowNull: true },
  sentAt: { type: DataTypes.DATE, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'notifications', underscored: true });

sequelizePaginate.paginate(Notification);
module.exports = Notification;

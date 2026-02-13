/**
 * Payment.js - Payment & Billing Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, allowNull: false },
  paymentMethod: { type: DataTypes.STRING(50), allowNull: false }, // cod | card | paypal | stripe | gift_card | loyalty_points
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING(50), allowNull: true },
  transactionReference: { type: DataTypes.STRING(255), allowNull: true },
  paidAt: { type: DataTypes.DATE, allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'payments', underscored: true });

sequelizePaginate.paginate(Payment);
module.exports = Payment;

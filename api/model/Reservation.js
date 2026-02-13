/**
 * Reservation.js - Table reservations
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Reservation = sequelize.define('Reservation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  locationId: { type: DataTypes.INTEGER, allowNull: false },
  customerId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  guestName: { type: DataTypes.STRING(255), allowNull: true },
  guestEmail: { type: DataTypes.STRING(255), allowNull: true },
  guestPhone: { type: DataTypes.STRING(50), allowNull: true },
  reservationDate: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: true },
  partySize: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
  status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'pending' }, // pending | confirmed | seated | completed | cancelled | no_show
  notes: { type: DataTypes.TEXT, allowNull: true },
  tableNumber: { type: DataTypes.STRING(50), allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'reservations', underscored: true });

sequelizePaginate.paginate(Reservation);
module.exports = Reservation;

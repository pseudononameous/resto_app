/**
 * Product.js - Product Catalog Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  basePrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  activeFlag: { type: DataTypes.BOOLEAN, defaultValue: true },
  imageUrl: { type: DataTypes.STRING(500), allowNull: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'products', underscored: true });

sequelizePaginate.paginate(Product);
module.exports = Product;

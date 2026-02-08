/**
 * ProductRecipe.js - Inventory Service
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
const sequelizePaginate = require('sequelize-paginate');

const ProductRecipe = sequelize.define('ProductRecipe', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  inventoryId: { type: DataTypes.INTEGER, allowNull: false },
  quantityRequired: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 1 },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'product_recipes', underscored: true });

sequelizePaginate.paginate(ProductRecipe);
module.exports = ProductRecipe;

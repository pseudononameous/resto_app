/**
 * index.js
 * @description :: exports all models and associations for Unified Restaurant Commerce Platform
 */

const dbConnection = require('../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

// Identity & Access
db.User = require('./User');
db.RolePermission = require('./RolePermission');

// Product Catalog
db.Category = require('./Category');
db.Product = require('./Product');
db.ModifierGroup = require('./ModifierGroup');
db.Modifier = require('./Modifier');

// Menu
db.Menu = require('./Menu');
db.MenuItem = require('./MenuItem');

// Inventory
db.InventoryItem = require('./InventoryItem');
db.ProductRecipe = require('./ProductRecipe');

// Ordering
db.Order = require('./Order');
db.OrderItem = require('./OrderItem');
db.OrderItemModifier = require('./OrderItemModifier');

// Payment
db.Payment = require('./Payment');
db.Refund = require('./Refund');

// Loyalty
db.LoyaltyAccount = require('./LoyaltyAccount');
db.PointsTransaction = require('./PointsTransaction');
db.Reward = require('./Reward');

// Promotions
db.Promotion = require('./Promotion');
db.PromotionRedemption = require('./PromotionRedemption');

// Gift Card
db.GiftCard = require('./GiftCard');
db.GiftCardTransaction = require('./GiftCardTransaction');

// Delivery
db.Delivery = require('./Delivery');
db.DeliveryTracking = require('./DeliveryTracking');

// Multi-location & operations
db.Location = require('./Location');
db.DeliveryZone = require('./DeliveryZone');
db.ServiceHours = require('./ServiceHours');
db.HolidaySchedule = require('./HolidaySchedule');
db.Reservation = require('./Reservation');
db.CustomerAddress = require('./CustomerAddress');
db.ProductModifierGroup = require('./ProductModifierGroup');

// Notification
db.Notification = require('./Notification');

// Associations

// Category self-reference
db.Category.belongsTo(db.Category, { foreignKey: 'parentCategoryId', as: 'parentCategory' });
db.Category.hasMany(db.Category, { foreignKey: 'parentCategoryId', as: 'children' });

// Product -> Category
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
db.Category.hasMany(db.Product, { foreignKey: 'categoryId' });

// Modifier -> ModifierGroup
db.Modifier.belongsTo(db.ModifierGroup, { foreignKey: 'modifierGroupId', as: 'modifierGroup' });
db.ModifierGroup.hasMany(db.Modifier, { foreignKey: 'modifierGroupId', as: 'modifiers' });

// Menu -> Location
db.Menu.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.Menu, { foreignKey: 'locationId' });

// MenuItem -> Menu, Product
db.MenuItem.belongsTo(db.Menu, { foreignKey: 'menuId', as: 'menu' });
db.Menu.hasMany(db.MenuItem, { foreignKey: 'menuId', as: 'menuItems' });
db.MenuItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
db.Product.hasMany(db.MenuItem, { foreignKey: 'productId' });

// Product <-> ModifierGroup (many-to-many via ProductModifierGroup)
db.ProductModifierGroup.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
db.Product.hasMany(db.ProductModifierGroup, { foreignKey: 'productId', as: 'productModifierGroups' });
db.ProductModifierGroup.belongsTo(db.ModifierGroup, { foreignKey: 'modifierGroupId', as: 'modifierGroup' });
db.ModifierGroup.hasMany(db.ProductModifierGroup, { foreignKey: 'modifierGroupId' });

// ProductRecipe -> Product, InventoryItem
db.ProductRecipe.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
db.Product.hasMany(db.ProductRecipe, { foreignKey: 'productId' });
db.ProductRecipe.belongsTo(db.InventoryItem, { foreignKey: 'inventoryId', as: 'inventoryItem' });
db.InventoryItem.hasMany(db.ProductRecipe, { foreignKey: 'inventoryId' });

// Order -> User (customer), Location, DeliveryZone
db.Order.belongsTo(db.User, { foreignKey: 'customerId', as: 'customer' });
db.User.hasMany(db.Order, { foreignKey: 'customerId' });
db.Order.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.Order, { foreignKey: 'locationId' });
db.Order.belongsTo(db.DeliveryZone, { foreignKey: 'deliveryZoneId', as: 'deliveryZone' });
db.DeliveryZone.hasMany(db.Order, { foreignKey: 'deliveryZoneId' });

// OrderItem -> Order, Product
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });
db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
db.Product.hasMany(db.OrderItem, { foreignKey: 'productId' });

// OrderItemModifier -> OrderItem, Modifier
db.OrderItemModifier.belongsTo(db.OrderItem, { foreignKey: 'orderItemId', as: 'orderItem' });
db.OrderItem.hasMany(db.OrderItemModifier, { foreignKey: 'orderItemId' });
db.OrderItemModifier.belongsTo(db.Modifier, { foreignKey: 'modifierId', as: 'modifier' });
db.Modifier.hasMany(db.OrderItemModifier, { foreignKey: 'modifierId' });

// Payment -> Order
db.Payment.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });
db.Order.hasMany(db.Payment, { foreignKey: 'orderId' });

// Refund -> Payment
db.Refund.belongsTo(db.Payment, { foreignKey: 'paymentId', as: 'payment' });
db.Payment.hasMany(db.Refund, { foreignKey: 'paymentId' });

// LoyaltyAccount -> User (customerId)
db.LoyaltyAccount.belongsTo(db.User, { foreignKey: 'customerId', as: 'customer' });
db.User.hasOne(db.LoyaltyAccount, { foreignKey: 'customerId' });

// PointsTransaction -> User
db.PointsTransaction.belongsTo(db.User, { foreignKey: 'customerId', as: 'customer' });
db.User.hasMany(db.PointsTransaction, { foreignKey: 'customerId' });

// PromotionRedemption -> Promotion, Order, User
db.PromotionRedemption.belongsTo(db.Promotion, { foreignKey: 'promotionId', as: 'promotion' });
db.Promotion.hasMany(db.PromotionRedemption, { foreignKey: 'promotionId' });
db.PromotionRedemption.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });
db.PromotionRedemption.belongsTo(db.User, { foreignKey: 'customerId', as: 'customer' });

// GiftCardTransaction -> GiftCard
db.GiftCardTransaction.belongsTo(db.GiftCard, { foreignKey: 'cardId', as: 'giftCard' });
db.GiftCard.hasMany(db.GiftCardTransaction, { foreignKey: 'cardId' });

// Delivery -> Order, User (provider), DeliveryZone
db.Delivery.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });
db.Order.hasOne(db.Delivery, { foreignKey: 'orderId' });
db.Delivery.belongsTo(db.User, { foreignKey: 'providerId', as: 'provider' });
db.User.hasMany(db.Delivery, { foreignKey: 'providerId' });
db.Delivery.belongsTo(db.DeliveryZone, { foreignKey: 'deliveryZoneId', as: 'deliveryZone' });
db.DeliveryZone.hasMany(db.Delivery, { foreignKey: 'deliveryZoneId' });

// DeliveryZone -> Location
db.DeliveryZone.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.DeliveryZone, { foreignKey: 'locationId' });

// ServiceHours -> Location
db.ServiceHours.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.ServiceHours, { foreignKey: 'locationId' });

// HolidaySchedule -> Location
db.HolidaySchedule.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.HolidaySchedule, { foreignKey: 'locationId' });

// Reservation -> Location, User (customer)
db.Reservation.belongsTo(db.Location, { foreignKey: 'locationId', as: 'location' });
db.Location.hasMany(db.Reservation, { foreignKey: 'locationId' });
db.Reservation.belongsTo(db.User, { foreignKey: 'customerId', as: 'customer' });
db.User.hasMany(db.Reservation, { foreignKey: 'customerId' });

// CustomerAddress -> User
db.CustomerAddress.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.User.hasMany(db.CustomerAddress, { foreignKey: 'userId' });

// DeliveryTracking -> Delivery
db.DeliveryTracking.belongsTo(db.Delivery, { foreignKey: 'deliveryId', as: 'delivery' });
db.Delivery.hasMany(db.DeliveryTracking, { foreignKey: 'deliveryId' });

// Notification -> User
db.Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
db.User.hasMany(db.Notification, { foreignKey: 'userId' });

module.exports = db;

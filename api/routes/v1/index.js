const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const authRoutes = require('./authRoutes');

// Unified Restaurant Commerce Platform APIs
const userRoutes = require('./userRoutes');
const rolePermissionRoutes = require('./rolePermissionRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const modifierGroupRoutes = require('./modifierGroupRoutes');
const modifierRoutes = require('./modifierRoutes');
const menuRoutes = require('./menuRoutes');
const menuItemRoutes = require('./menuItemRoutes');
const inventoryItemRoutes = require('./inventoryItemRoutes');
const productRecipeRoutes = require('./productRecipeRoutes');
const orderRoutes = require('./orderRoutes');
const orderItemRoutes = require('./orderItemRoutes');
const orderItemModifierRoutes = require('./orderItemModifierRoutes');
const paymentRoutes = require('./paymentRoutes');
const refundRoutes = require('./refundRoutes');
const loyaltyAccountRoutes = require('./loyaltyAccountRoutes');
const pointsTransactionRoutes = require('./pointsTransactionRoutes');
const rewardRoutes = require('./rewardRoutes');
const promotionRoutes = require('./promotionRoutes');
const promotionRedemptionRoutes = require('./promotionRedemptionRoutes');
const giftCardRoutes = require('./giftCardRoutes');
const giftCardTransactionRoutes = require('./giftCardTransactionRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const deliveryTrackingRoutes = require('./deliveryTrackingRoutes');
const notificationRoutes = require('./notificationRoutes');
const locationRoutes = require('./locationRoutes');
const deliveryZoneRoutes = require('./deliveryZoneRoutes');
const serviceHoursRoutes = require('./serviceHoursRoutes');
const holidayScheduleRoutes = require('./holidayScheduleRoutes');
const reservationRoutes = require('./reservationRoutes');
const customerAddressRoutes = require('./customerAddressRoutes');
const productModifierGroupRoutes = require('./productModifierGroupRoutes');
const publicRoutes = require('./publicRoutes');

router.use(healthRoutes);
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);

// 1. Identity & Access Service
router.use('/users', userRoutes);
router.use('/role-permissions', rolePermissionRoutes);

// 2. Product Catalog Service
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/modifier-groups', modifierGroupRoutes);
router.use('/modifiers', modifierRoutes);
router.use('/product-modifier-groups', productModifierGroupRoutes);

// 3. Menu Service
router.use('/menus', menuRoutes);
router.use('/menu-items', menuItemRoutes);

// 4. Inventory Service
router.use('/inventory-items', inventoryItemRoutes);
router.use('/product-recipes', productRecipeRoutes);

// 5. Ordering Service
router.use('/orders', orderRoutes);
router.use('/order-items', orderItemRoutes);
router.use('/order-item-modifiers', orderItemModifierRoutes);

// 6. Payment & Billing Service
router.use('/payments', paymentRoutes);
router.use('/refunds', refundRoutes);

// 7. Loyalty & Rewards Service
router.use('/loyalty-accounts', loyaltyAccountRoutes);
router.use('/points-transactions', pointsTransactionRoutes);
router.use('/rewards', rewardRoutes);

// 8. Promotions & Offers Service
router.use('/promotions', promotionRoutes);
router.use('/promotion-redemptions', promotionRedemptionRoutes);

// 9. Gift Card Service
router.use('/gift-cards', giftCardRoutes);
router.use('/gift-card-transactions', giftCardTransactionRoutes);

// 10. Delivery Management Service
router.use('/deliveries', deliveryRoutes);
router.use('/delivery-trackings', deliveryTrackingRoutes);

// 11. Notification Service
router.use('/notifications', notificationRoutes);

// 12. Locations & Operations
router.use('/locations', locationRoutes);
router.use('/delivery-zones', deliveryZoneRoutes);
router.use('/service-hours', serviceHoursRoutes);
router.use('/holiday-schedules', holidayScheduleRoutes);
router.use('/reservations', reservationRoutes);
router.use('/customer-addresses', customerAddressRoutes);

module.exports = router;

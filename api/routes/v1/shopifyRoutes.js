const express = require('express');
const router = express.Router();
const shopifyController = require('../../controller/shopifyController');

router.get('/shop', shopifyController.shop);
router.get('/products', shopifyController.products);
router.get('/products/:id', shopifyController.product);
router.get('/orders', shopifyController.orders);
router.get('/orders/:id', shopifyController.order);
router.get('/inventory', shopifyController.inventory);
router.get('/customers', shopifyController.customers);
router.get('/customers/:id/events', shopifyController.customerEvents);
router.get('/customers/:id', shopifyController.customer);
router.get('/draft_orders', shopifyController.draftOrders);
router.get('/draft_orders/:id', shopifyController.draftOrder);
router.get('/gift_cards', shopifyController.giftCards);
router.get('/fulfillment_orders', shopifyController.fulfillmentOrders);
router.get('/product_feeds', shopifyController.productFeeds);
router.get('/analytics', shopifyController.analytics);

module.exports = router;

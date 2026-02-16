/**
 * Shopify proxy controller – read-only endpoints for frontend.
 */

const shopifyService = require('../services/shopifyService');

function sendResult(res, data) {
  if (data && data.error) {
    return res.status(data.status || 500).json({ error: data.error, status: data.status });
  }
  return res.json(data);
}

async function shop(req, res) {
  const data = await shopifyService.getShop();
  return sendResult(res, data);
}

async function products(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const ids = req.query.ids || null;
  const data = await shopifyService.getProducts(limit, ids);
  return sendResult(res, data);
}

async function product(req, res) {
  const data = await shopifyService.getProduct(req.params.id);
  return sendResult(res, data);
}

async function orders(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const status = req.query.status || 'any';
  const data = await shopifyService.getOrders(limit, status);
  return sendResult(res, data);
}

async function order(req, res) {
  const data = await shopifyService.getOrder(req.params.id);
  return sendResult(res, data);
}

async function inventory(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const locationIds = req.query.location_ids || null;
  const data = await shopifyService.getInventoryLevels(limit, locationIds);
  return sendResult(res, data);
}

async function customers(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const ids = req.query.ids || null;
  const data = await shopifyService.getCustomers(limit, ids);
  return sendResult(res, data);
}

async function customer(req, res) {
  const data = await shopifyService.getCustomer(req.params.id);
  return sendResult(res, data);
}

async function customerEvents(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const data = await shopifyService.getCustomerEvents(req.params.id, limit);
  return sendResult(res, data);
}

async function draftOrders(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const status = req.query.status || 'any';
  const data = await shopifyService.getDraftOrders(limit, status);
  return sendResult(res, data);
}

async function draftOrder(req, res) {
  const data = await shopifyService.getDraftOrder(req.params.id);
  return sendResult(res, data);
}

async function giftCards(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const status = req.query.status || 'enabled';
  const data = await shopifyService.getGiftCards(limit, status);
  return sendResult(res, data);
}

async function fulfillmentOrders(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const assignmentStatus = req.query.assignment_status || null;
  const data = await shopifyService.getAssignedFulfillmentOrders(limit, assignmentStatus);
  return sendResult(res, data);
}

async function productFeeds(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const data = await shopifyService.getProductFeeds(limit);
  return sendResult(res, data);
}

async function analytics(req, res) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 250);
  const data = await shopifyService.getReports(limit);
  return sendResult(res, data);
}

module.exports = {
  shop,
  products,
  product,
  orders,
  order,
  inventory,
  customers,
  customer,
  customerEvents,
  draftOrders,
  draftOrder,
  giftCards,
  fulfillmentOrders,
  productFeeds,
  analytics,
};

/**
 * Shopify Admin REST API client (read-only proxy).
 */

const axios = require('axios');
const shopifyConfig = require('../config/shopify');

function checkConfig() {
  const { storeDomain, accessToken } = shopifyConfig;
  if (!storeDomain || !storeDomain.length) {
    return {
      error: 'SHOPIFY_STORE_DOMAIN is not set. Add it to api/.env (e.g. fiteats1.myshopify.com).',
      status: 503,
    };
  }
  if (!accessToken || !accessToken.length) {
    return {
      error: 'SHOPIFY_ACCESS_TOKEN is not set. Add your Admin API access token (shpat_...) from Shopify to api/.env.',
      status: 503,
    };
  }
  return null;
}

async function get(path, query = {}) {
  const configError = checkConfig();
  if (configError) return configError;

  const url = `${shopifyConfig.baseUrl}${path}`;
  try {
    const { data, status } = await axios.get(url, {
      params: query,
      headers: {
        'X-Shopify-Access-Token': shopifyConfig.accessToken,
        'Content-Type': 'application/json',
      },
      validateStatus: () => true,
    });

    if (status >= 400) {
      const message = status === 401
        ? 'Shopify rejected the request. Set SHOPIFY_ACCESS_TOKEN in api/.env to your Admin API access token (starts with shpat_).'
        : (data?.errors || data?.message || 'Shopify API error');
      return { error: message, status };
    }
    return data || {};
  } catch (err) {
    const message = err.response?.data?.errors || err.message || 'Shopify API error';
    const status = err.response?.status || 500;
    return { error: message, status };
  }
}

module.exports = {
  getShop: () => get('/shop.json'),
  getProducts: (limit = 50, ids = null) => {
    const q = { limit: Math.min(limit, 250) };
    if (ids) q.ids = ids;
    return get('/products.json', q);
  },
  getProduct: (id) => get(`/products/${id}.json`),
  getOrders: (limit = 50, status = 'any') =>
    get('/orders.json', { limit: Math.min(limit, 250), status }),
  getOrder: (id) => get(`/orders/${id}.json`),
  getInventoryLevels: (limit = 50, locationIds = null) => {
    const q = { limit: Math.min(limit, 250) };
    if (locationIds) q.location_ids = locationIds;
    return get('/inventory_levels.json', q);
  },
  getCustomers: (limit = 50, ids = null) => {
    const q = { limit: Math.min(limit, 250) };
    if (ids) q.ids = ids;
    return get('/customers.json', q);
  },
  getCustomer: (id) => get(`/customers/${id}.json`),
  getCustomerEvents: (customerId, limit = 50) =>
    get(`/customers/${customerId}/events.json`, { limit: Math.min(limit, 250) }),
  getDraftOrders: (limit = 50, status = 'any') =>
    get('/draft_orders.json', { limit: Math.min(limit, 250), status }),
  getDraftOrder: (id) => get(`/draft_orders/${id}.json`),
  getGiftCards: (limit = 50, status = 'enabled') =>
    get('/gift_cards.json', { limit: Math.min(limit, 250), status }),
  getAssignedFulfillmentOrders: (limit = 50, assignmentStatus = null) => {
    const q = { limit: Math.min(limit, 250) };
    if (assignmentStatus) q.assignment_status = assignmentStatus;
    return get('/assigned_fulfillment_orders.json', q);
  },
  getProductFeeds: (limit = 50) =>
    get('/product_feeds.json', { limit: Math.min(limit, 250) }),
  getReports: (limit = 50) =>
    get('/reports.json', { limit: Math.min(limit, 250) }),
};

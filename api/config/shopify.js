/**
 * Shopify Admin API config (from env).
 */

const domain = (process.env.SHOPIFY_STORE_DOMAIN || '').trim().replace(/\/+$/, '');
const token = (process.env.SHOPIFY_ACCESS_TOKEN || '').trim();
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

module.exports = {
  storeDomain: domain,
  accessToken: token,
  apiVersion,
  baseUrl: domain ? `https://${domain}/admin/api/${apiVersion}` : '',
};

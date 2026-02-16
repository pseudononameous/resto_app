import axios from "@utils/axios";

/** Shopify data via RestoApp Unified API (read-only) */
export const shopifyApi = {
  shop: () => axios.get("/v1/shopify/shop"),
  products: (params?: { limit?: number; ids?: string }) =>
    axios.get("/v1/shopify/products", { params }),
  product: (id: string) => axios.get(`/v1/shopify/products/${id}`),
  orders: (params?: { limit?: number; status?: string }) =>
    axios.get("/v1/shopify/orders", { params }),
  order: (id: string) => axios.get(`/v1/shopify/orders/${id}`),
  inventory: (params?: { limit?: number; location_ids?: string }) =>
    axios.get("/v1/shopify/inventory", { params }),
  customers: (params?: { limit?: number; ids?: string }) =>
    axios.get("/v1/shopify/customers", { params }),
  customer: (id: string) => axios.get(`/v1/shopify/customers/${id}`),
  customerEvents: (customerId: string, params?: { limit?: number }) =>
    axios.get(`/v1/shopify/customers/${customerId}/events`, { params }),
  draftOrders: (params?: { limit?: number; status?: string }) =>
    axios.get("/v1/shopify/draft_orders", { params }),
  draftOrder: (id: string) => axios.get(`/v1/shopify/draft_orders/${id}`),
  giftCards: (params?: { limit?: number; status?: string }) =>
    axios.get("/v1/shopify/gift_cards", { params }),
  fulfillmentOrders: (params?: { limit?: number; assignment_status?: string }) =>
    axios.get("/v1/shopify/fulfillment_orders", { params }),
  productFeeds: (params?: { limit?: number }) =>
    axios.get("/v1/shopify/product_feeds", { params }),
  analytics: (params?: { limit?: number }) =>
    axios.get("/v1/shopify/analytics", { params }),
};

/** Health check */
export const healthApi = {
  check: () => axios.get("/v1/health"),
};

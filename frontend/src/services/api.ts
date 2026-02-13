import axios from "@utils/axios";

/** Health check */
export const healthApi = {
  check: () => axios.get("/v1/health"),
};

/** RestoApp Online Ordering APIs */
export const restoApi = {
  // Public (no auth)
  getMenu: (params?: { locationId?: number; menuId?: number }) =>
    axios.get("/v1/public/menu", { params }),
  getLocations: () => axios.get("/v1/public/locations"),
  getDeliveryZones: (locationId: number) =>
    axios.get("/v1/public/delivery-zones", { params: { locationId } }),
  placeOrder: (data: PlaceOrderRequest) =>
    axios.post("/v1/public/place-order", data),
  getOrderStatus: (id: string) => axios.get(`/v1/public/order/${id}`),

  // CRUD (admin/operations)
  locations: {
    list: (body?: object) => axios.post("/v1/locations/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/locations/${id}`),
    create: (data: object) => axios.post("/v1/locations/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/locations/update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/locations/delete/${id}`),
  },
  deliveryZones: {
    list: (body?: object) => axios.post("/v1/delivery-zones/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/delivery-zones/${id}`),
    create: (data: object) => axios.post("/v1/delivery-zones/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/delivery-zones/update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/delivery-zones/delete/${id}`),
  },
  orders: {
    list: (body?: object) => axios.post("/v1/orders/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/orders/${id}`),
    update: (id: number, data: object) =>
      axios.put(`/v1/orders/partial-update/${id}`, data),
  },
  reservations: {
    list: (body?: object) => axios.post("/v1/reservations/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/reservations/${id}`),
    create: (data: object) => axios.post("/v1/reservations/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/reservations/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/reservations/delete/${id}`),
  },
  serviceHours: {
    list: (body?: object) => axios.post("/v1/service-hours/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/service-hours/${id}`),
    create: (data: object) => axios.post("/v1/service-hours/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/service-hours/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/service-hours/delete/${id}`),
  },
  holidaySchedules: {
    list: (body?: object) => axios.post("/v1/holiday-schedules/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/holiday-schedules/${id}`),
    create: (data: object) => axios.post("/v1/holiday-schedules/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/holiday-schedules/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/holiday-schedules/delete/${id}`),
  },
  customerAddresses: {
    list: (body?: object) => axios.post("/v1/customer-addresses/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/customer-addresses/${id}`),
    create: (data: object) => axios.post("/v1/customer-addresses/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/customer-addresses/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/customer-addresses/delete/${id}`),
  },
  menus: {
    list: (body?: object) => axios.post("/v1/menus/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/menus/${id}`),
    create: (data: object) => axios.post("/v1/menus/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/menus/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/menus/delete/${id}`),
  },
  categories: {
    list: (body?: object) => axios.post("/v1/categories/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/categories/${id}`),
    create: (data: object) => axios.post("/v1/categories/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/categories/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/categories/delete/${id}`),
  },
  products: {
    list: (body?: object) => axios.post("/v1/products/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/products/${id}`),
    create: (data: object) => axios.post("/v1/products/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/products/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/products/delete/${id}`),
  },
  modifierGroups: {
    list: (body?: object) => axios.post("/v1/modifier-groups/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/modifier-groups/${id}`),
    create: (data: object) => axios.post("/v1/modifier-groups/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/modifier-groups/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/modifier-groups/delete/${id}`),
  },
  modifiers: {
    list: (body?: object) => axios.post("/v1/modifiers/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/modifiers/${id}`),
    create: (data: object) => axios.post("/v1/modifiers/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/modifiers/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/modifiers/delete/${id}`),
  },
  productModifierGroups: {
    list: (body?: object) => axios.post("/v1/product-modifier-groups/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/product-modifier-groups/${id}`),
    create: (data: object) => axios.post("/v1/product-modifier-groups/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/product-modifier-groups/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/product-modifier-groups/delete/${id}`),
  },
  menuItems: {
    list: (body?: object) => axios.post("/v1/menu-items/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/menu-items/${id}`),
    create: (data: object) => axios.post("/v1/menu-items/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/menu-items/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/menu-items/delete/${id}`),
  },
  inventoryItems: {
    list: (body?: object) => axios.post("/v1/inventory-items/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/inventory-items/${id}`),
    create: (data: object) => axios.post("/v1/inventory-items/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/inventory-items/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/inventory-items/delete/${id}`),
  },
  productRecipes: {
    list: (body?: object) => axios.post("/v1/product-recipes/list", body ?? {}),
    get: (id: number) => axios.get(`/v1/product-recipes/${id}`),
    create: (data: object) => axios.post("/v1/product-recipes/create", data),
    update: (id: number, data: object) =>
      axios.put(`/v1/product-recipes/partial-update/${id}`, data),
    delete: (id: number) => axios.delete(`/v1/product-recipes/delete/${id}`),
  },
};

export interface PlaceOrderRequest {
  locationId?: number;
  orderType: "dine_in" | "takeout" | "delivery";
  scheduledAt?: string;
  customerId?: number;
  guestEmail?: string;
  guestName?: string;
  guestPhone?: string;
  deliveryZoneId?: number;
  deliveryFee?: number;
  deliveryAddress?: string;
  items: Array<{
    productId: number;
    quantity: number;
    displayPrice?: number;
    modifiers?: Array<{ modifierId: number }>;
  }>;
  paymentMethod?: string;
  notes?: string;
}

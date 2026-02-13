/**
 * publicController.js - Customer-facing APIs (no auth required)
 * - GET /public/menu - Menu with categories, items, modifiers
 * - GET /public/locations - Active locations
 * - GET /public/delivery-zones - Delivery zones for location
 * - POST /public/calculate-delivery-fee - Calculate fee from address
 * - POST /public/place-order - Create order (guest or logged-in)
 * - GET /public/order/:id - Get order status (by id or tracking)
 */

const db = require('../model');
const { Op } = require('sequelize');

/**
 * GET /public/menu?locationId=1&menuId=1
 * Returns menu structure: categories with products (menu items) and modifier groups
 */
async function getMenu(req, res) {
  try {
    const { locationId, menuId } = req.query;

    let menuWhere = { activeFlag: true };
    if (menuId) menuWhere.id = menuId;
    if (locationId) menuWhere.locationId = locationId;

    const menus = await db.Menu.findAll({
      where: menuWhere,
      include: [{
        model: db.MenuItem,
        as: 'menuItems',
        required: false,
        where: { availabilityStatus: { [Op.ne]: 'out_of_stock' } },
        include: [{
          model: db.Product,
          as: 'product',
          include: [{
            model: db.Category,
            as: 'category',
            attributes: ['id', 'name'],
          }, {
            model: db.ProductModifierGroup,
            as: 'productModifierGroups',
            include: [{
              model: db.ModifierGroup,
              as: 'modifierGroup',
              include: [{
                model: db.Modifier,
                as: 'modifiers',
              }],
            }],
          }],
        }],
      }],
      order: [[{ model: db.MenuItem, as: 'menuItems' }, 'sortOrder', 'ASC']],
    });

    if (!menus || menus.length === 0) {
      return res.success({ data: { menus: [], categories: [] } });
    }

    // Group menu items by category for easier frontend consumption
    const categoryMap = new Map();
    menus.forEach((menu) => {
      (menu.menuItems || []).forEach((mi) => {
        if (mi.product && mi.product.category) {
          const cat = mi.product.category;
          if (!categoryMap.has(cat.id)) {
            categoryMap.set(cat.id, {
              id: cat.id,
              name: cat.name,
              items: [],
            });
          }
          const product = mi.product.toJSON();
          product.modifierGroups = (product.productModifierGroups || []).map((pmg) => {
            const mg = pmg.modifierGroup;
            if (!mg) return null;
            return {
              id: mg.id,
              name: mg.name,
              selectionType: mg.selectionType,
              requiredFlag: mg.requiredFlag,
              modifiers: (mg.modifiers || []).map((m) => ({
                id: m.id,
                name: m.name,
                priceDelta: parseFloat(m.priceDelta),
              })),
            };
          }).filter(Boolean);
          delete product.productModifierGroups;

          categoryMap.get(cat.id).items.push({
            menuItemId: mi.id,
            productId: product.id,
            displayPrice: mi.displayPrice != null ? parseFloat(mi.displayPrice) : parseFloat(product.basePrice),
            availabilityStatus: mi.availabilityStatus,
            ...product,
          });
        }
      });
    });

    const categories = Array.from(categoryMap.values());

    return res.success({
      data: {
        menus: menus.map((m) => ({ id: m.id, name: m.name })),
        categories,
      },
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
}

/**
 * GET /public/locations - Active locations
 */
async function getLocations(req, res) {
  try {
    const locations = await db.Location.findAll({
      where: { activeFlag: true },
      attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode', 'phone', 'latitude', 'longitude'],
    });
    return res.success({ data: locations });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
}

/**
 * GET /public/delivery-zones?locationId=1
 */
async function getDeliveryZones(req, res) {
  try {
    const { locationId } = req.query;
    if (!locationId) {
      return res.badRequest({ message: 'locationId is required' });
    }
    const zones = await db.DeliveryZone.findAll({
      where: { locationId, activeFlag: true },
      order: [['minDistanceKm', 'ASC']],
    });
    return res.success({ data: zones });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
}

/**
 * POST /public/place-order
 * Body: { locationId, orderType, scheduledAt?, customerId?, guestEmail?, guestName?, guestPhone?,
 *         deliveryZoneId?, deliveryFee?, deliveryAddress?, items: [{ productId, quantity, modifiers: [{ modifierId }] }],
 *         paymentMethod, notes? }
 */
async function placeOrder(req, res) {
  try {
    const {
      locationId,
      orderType,
      scheduledAt,
      customerId,
      guestEmail,
      guestName,
      guestPhone,
      deliveryZoneId,
      deliveryFee = 0,
      deliveryAddress,
      items,
      paymentMethod = 'cod',
      notes,
    } = req.body || {};

    if (!orderType || !items || !Array.isArray(items) || items.length === 0) {
      return res.badRequest({ message: 'orderType and items are required' });
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      return res.badRequest({ message: 'deliveryAddress is required for delivery orders' });
    }

    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await db.Product.findByPk(item.productId);
      if (!product) {
        return res.badRequest({ message: `Product ${item.productId} not found` });
      }
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      let unitPrice = parseFloat(product.basePrice);
      if (item.displayPrice != null) unitPrice = parseFloat(item.displayPrice);

      let modifierTotal = 0;
      const modifierIds = [];
      if (item.modifiers && Array.isArray(item.modifiers)) {
        for (const m of item.modifiers) {
          const mod = await db.Modifier.findByPk(m.modifierId);
          if (mod) {
            modifierTotal += parseFloat(mod.priceDelta) * qty;
            modifierIds.push(mod.id);
          }
        }
      }

      const lineTotal = (unitPrice * qty) + modifierTotal;
      subtotal += lineTotal;
      orderItemsData.push({
        productId: product.id,
        quantity: qty,
        unitPrice: unitPrice + (modifierTotal / qty),
        modifierIds,
      });
    }

    const totalAmount = subtotal + parseFloat(deliveryFee || 0);

    const order = await db.Order.create({
      customerId: customerId || null,
      locationId: locationId || null,
      orderType,
      orderStatus: 'pending',
      scheduledAt: scheduledAt || null,
      subtotal,
      discountAmount: 0,
      deliveryFee: parseFloat(deliveryFee || 0),
      totalAmount,
      deliveryZoneId: deliveryZoneId || null,
      guestEmail: guestEmail || null,
      guestName: guestName || null,
      guestPhone: guestPhone || null,
      notes: notes || null,
    });

    // Create order items and order item modifiers
    for (const oi of orderItemsData) {
      const orderItem = await db.OrderItem.create({
        orderId: order.id,
        productId: oi.productId,
        quantity: oi.quantity,
        unitPrice: oi.unitPrice,
      });
      if (oi.modifierIds && oi.modifierIds.length) {
        await db.OrderItemModifier.bulkCreate(
          oi.modifierIds.map((modifierId) => ({
            orderItemId: orderItem.id,
            modifierId,
          }))
        );
      }
    }

    // Create payment record
    await db.Payment.create({
      orderId: order.id,
      paymentMethod,
      amount: totalAmount,
      status: paymentMethod === 'cod' ? 'pending' : 'pending',
    });

    // Create delivery record if delivery order
    if (orderType === 'delivery') {
      await db.Delivery.create({
        orderId: order.id,
        deliveryZoneId: deliveryZoneId || null,
        deliveryAddress: deliveryAddress || null,
        deliveryFee: parseFloat(deliveryFee || 0),
        deliveryStatus: 'pending',
      });
    }

    const created = await db.Order.findByPk(order.id, {
      include: [
        { model: db.OrderItem, as: 'orderItems', include: [{ model: db.Product, as: 'product' }] },
      ],
    });

    return res.success({
      message: 'Order placed successfully',
      data: created,
    });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
}

/**
 * GET /public/order/:id - Get order status (for tracking)
 */
async function getOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const order = await db.Order.findByPk(id, {
      attributes: ['id', 'orderType', 'orderStatus', 'totalAmount', 'scheduledAt', 'createdAt'],
      include: [
        { model: db.Location, as: 'location', attributes: ['id', 'name', 'address'] },
      ],
    });
    if (!order) return res.recordNotFound();
    return res.success({ data: order });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
}

module.exports = {
  getMenu,
  getLocations,
  getDeliveryZones,
  placeOrder,
  getOrderStatus,
};

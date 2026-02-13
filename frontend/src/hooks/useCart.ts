import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  productId: number;
  menuItemId?: number;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers?: Array<{ modifierId: number; name: string; priceDelta: number }>;
  displayPrice?: number;
}

const CART_KEY = "resto_cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const qty = item.quantity ?? 1;
      const price = item.displayPrice ?? item.unitPrice;
      const modifierTotal = (item.modifiers ?? []).reduce((s, m) => s + m.priceDelta, 0);
      const unitPrice = price + modifierTotal;
      const key = `${item.productId}-${JSON.stringify((item.modifiers ?? []).map((m) => m.modifierId).sort())}`;
      const idx = prev.findIndex(
        (i) =>
          i.productId === item.productId &&
          JSON.stringify((i.modifiers ?? []).map((m) => m.modifierId).sort()) ===
          JSON.stringify((item.modifiers ?? []).map((m) => m.modifierId).sort())
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [
        ...prev,
        {
          ...item,
          quantity: qty,
          unitPrice,
          displayPrice: price,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((_, i) => i !== index);
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce(
    (sum, i) => sum + (i.unitPrice * i.quantity),
    0
  );

  const count = items.reduce((s, i) => s + i.quantity, 0);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    count,
  };
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'pj_essence_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [giftWrapping, setGiftWrapping] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const addItem = (product, quantity = 1, customData = null) => {
    setItems(currentItems => {
      const itemKey = customData 
        ? `custom_${product.id}_${JSON.stringify(customData.notes)}`
        : product.id;

      const existingIndex = currentItems.findIndex(item => item.cartItemId === itemKey);

      if (existingIndex > -1) {
        const next = [...currentItems];
        next[existingIndex].quantity += quantity;
        return next;
      }

      const newItem = {
        cartItemId: itemKey,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        type: product.type,
        unitPrice: Number(product.price),
        quantity,
        image: Array.isArray(product.images) && product.images[0] ? product.images[0] : '',
        isCustom: Boolean(customData),
        customData: customData || null,
        attributes: product.attributes || {},
      };

      return [...currentItems, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (cartItemId) => {
    setItems(current => current.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const giftWrappingFee = giftWrapping ? 15 : 0;
  const estimatedTax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + shippingCost + giftWrappingFee + estimatedTax;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        total,
        itemCount,
        freeShippingThreshold,
        amountToFreeShipping,
        shippingCost,
        giftWrapping,
        setGiftWrapping,
        giftWrappingFee,
        estimatedTax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

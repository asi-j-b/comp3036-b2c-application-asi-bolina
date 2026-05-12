"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/mockProducts";

export type CartItem = {
  product: Product;
  quantity: number;
};

export function useCart(products: Product[]) {
  const [cart, setCart] = useState<Record<number, number>>({});

  function addToCart(productId: number) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  }

  function removeFromCart(productId: number) {
    setCart((current) => {
      const nextQuantity = (current[productId] ?? 0) - 1;

      if (nextQuantity <= 0) {
        const { [productId]: _removed, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [productId]: nextQuantity,
      };
    });
  }

  function clearCart() {
    setCart({});
  }

  const cartItems = useMemo<CartItem[]>(() => {
    return products
      .filter((product) => (cart[product.id] ?? 0) > 0)
      .map((product) => ({
        product,
        quantity: cart[product.id] ?? 0,
      }));
  }, [cart, products]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return {
    addToCart,
    cartCount,
    cartItems,
    cartTotal,
    clearCart,
    removeFromCart,
  };
}
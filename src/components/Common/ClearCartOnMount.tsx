"use client";
import { useCartStore } from "@/store/cart.store";
import { useEffect } from "react";

/** Clears the cart once on mount — used after successful payment. */
export function ClearCartOnMount() {
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  return null;
}

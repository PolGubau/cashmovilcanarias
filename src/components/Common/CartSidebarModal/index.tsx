"use client";
import { Drawer } from "@/components/ui/drawer";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import Link from "next/link";
import React from "react";
import EmptyCart from "./EmptyCart";
import SingleItem from "./SingleItem";

const CartSidebarModal = () => {
  const { isCartSidebarOpen, closeCartSidebar } = useUIStore();
  const cartItems = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice)();

  const hasItems = cartItems.length > 0;

  const footer = hasItems ? (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-dark-4">Subtotal</span>
        <span className="font-semibold text-lg text-dark">${totalPrice}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link
          onClick={closeCartSidebar}
          href="/cart"
          className="w-full flex justify-center font-medium text-dark bg-gray-2 py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-gray-3"
        >
          Ver carrito
        </Link>
        <Link
          href="/checkout"
          className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg transition-opacity duration-200 hover:opacity-90"
        >
          Finalizar compra
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <Drawer
      open={isCartSidebarOpen}
      onClose={closeCartSidebar}
      title="Carrito"
      description={
        hasItems
          ? `${cartItems.length} artículo${cartItems.length > 1 ? "s" : ""}`
          : undefined
      }
      footer={footer}
      size="md"
    >
      <div className="flex flex-col gap-5">
        {hasItems ? (
          cartItems.map((item) => (
            <SingleItem
              key={item.id}
              item={item}
            />
          ))
        ) : (
          <EmptyCart />
        )}
      </div>
    </Drawer>
  );
};

export default CartSidebarModal;

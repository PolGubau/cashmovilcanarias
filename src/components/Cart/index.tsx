"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React from "react";
import Breadcrumb from "../Common/Breadcrumb";

import OrderSummary from "./OrderSummary";
import SingleItem from "./SingleItem";

const Cart = () => {
  const cartItems = useCartStore((s) => s.items);

  return (
    <>
      {/* <!-- ===== Breadcrumb Section Start ===== --> */}
      <section>
        <Breadcrumb title={"Carrito"} pages={["Carrito"]} />
      </section>
      {/* <!-- ===== Breadcrumb Section End ===== --> */}
      {cartItems.length > 0 ? (
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <div className="flex flex-wrap items-center justify-between gap-5 mb-7.5">
              <h2 className="font-medium text-dark text-2xl">Tu carrito</h2>
              <Button variant="ghost" className="text-blue hover:text-blue-dark px-0">Vaciar carrito</Button>
            </div>

            <div className="bg-white rounded-[10px] shadow-1">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1170px]">
                  {/* <!-- table header --> */}
                  <div className="flex items-center py-5.5 px-7.5">
                    <div className="min-w-[400px]">
                      <p className="text-dark">Producto</p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-dark">Precio</p>
                    </div>

                    <div className="min-w-[275px]">
                      <p className="text-dark">Cantidad</p>
                    </div>

                    <div className="min-w-[200px]">
                      <p className="text-dark">Subtotal</p>

                    </div>

                    <div className="min-w-[50px]">
                      <p className="text-dark text-right">Acción</p>
                    </div>
                  </div>

                  {/* <!-- cart item --> */}
                  {cartItems.length > 0 &&
                    cartItems.map((item) => (
                      <SingleItem item={item} key={item.id} />
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11 mt-9">
              <OrderSummary />
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="text-center mt-8">
            <div className="mx-auto pb-7.5">
              <div className="mx-auto w-25 h-25 rounded-full bg-gray-2 flex items-center justify-center">
                <ShoppingCart className="size-12 text-gray-4" />
              </div>
            </div>

            <p className="pb-6">¡Tu carrito está vacío!</p>

            <Link
              href="/shop-with-sidebar"
              className="w-96 mx-auto flex justify-center font-medium text-white bg-dark py-[13px] px-6 rounded-md ease-out duration-200 hover:bg-opacity-95"
            >
              Seguir comprando
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;

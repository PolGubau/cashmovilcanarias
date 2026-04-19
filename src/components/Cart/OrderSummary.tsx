import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import React from "react";

const OrderSummary = () => {
  const cartItems = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice)();

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Resumen del pedido</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Producto</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>

            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.name}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  ${item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Total</p>

            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${totalPrice}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <Button type="submit" size="lg" className="w-full mt-7.5">
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

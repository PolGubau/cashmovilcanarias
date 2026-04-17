import { Button } from "@/components/ui";
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const SingleItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      dispatch(updateCartItemQuantity({ id: item.id, quantity: quantity - 1 }));
    } else {
      return;
    }
  };

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-7.5">
      <div className="min-w-[400px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
              <Image
                width={200}
                height={200}
                src={
                  item.primary_image_url ?? "/images/products/placeholder.png"
                }
                alt="product"
              />
            </div>

            <div>
              <h3 className="text-dark ease-out duration-200 hover:text-blue">
                <a href="#"> {item.name} </a>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-[180px]">
        <p className="text-dark">${item.price}</p>
      </div>

      <div className="min-w-[275px]">
        <div className="w-max flex items-center rounded-md border border-gray-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDecreaseQuantity}
            aria-label="Reducir cantidad"
            className="w-11.5 h-11.5 rounded-none rounded-l-md hover:text-blue"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <span className="flex items-center justify-center w-16 h-11.5 border-x border-gray-4">
            {quantity}
          </span>

          <Button
            type="button"
            variant="ghost"
            onClick={handleIncreaseQuantity}
            aria-label="Aumentar cantidad"
            className="w-11.5 h-11.5 rounded-none rounded-r-md hover:text-blue"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="min-w-[200px]">
        <p className="text-dark">${item.price * quantity}</p>
      </div>

      <div className="min-w-[50px] flex justify-end">
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          onClick={handleRemoveFromCart}
          aria-label="Eliminar del carrito"
          className="h-9.5 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SingleItem;

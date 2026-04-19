import { Button, QuantityStepper } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const SingleItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleRemoveFromCart = () => removeItem(item.id);

  const handleIncreaseQuantity = () => {
    const next = quantity + 1;
    setQuantity(next);
    updateQuantity(item.id, next);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const prev = quantity - 1;
      setQuantity(prev);
      updateQuantity(item.id, prev);
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
        <QuantityStepper
          value={quantity}
          onDecrease={handleDecreaseQuantity}
          onIncrease={handleIncreaseQuantity}
          min={1}
          size="lg"
        />
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
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default SingleItem;

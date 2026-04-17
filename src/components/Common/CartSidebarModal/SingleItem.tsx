import { Button } from "@/components/ui";
import type { AppDispatch } from "@/redux/store";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

const SingleItem = ({ item, removeItemFromCart }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFromCart = () => {
    dispatch(removeItemFromCart(item.id));
  };

  return (
    <div className="flex items-center justify-between gap-5">
      <div className="w-full flex items-center gap-6">
        <div className="flex items-center justify-center rounded-[10px] bg-gray-3 max-w-[90px] w-full h-22.5">
          <Image
            src={item.primary_image_url ?? "/images/products/placeholder.png"}
            alt="product"
            width={100}
            height={100}
          />
        </div>

        <div>
          <h3 className="font-medium text-dark mb-1 ease-out duration-200 hover:text-blue">
            <a href="#"> {item.name} </a>
          </h3>
          <p className="text-custom-sm">Precio: ${item.price}</p>
        </div>
      </div>

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
  );
};

export default SingleItem;

import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { CircleAlert, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const SingleItem = ({ item }) => {
  const removeFromWishlist = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  const handleRemoveFromWishlist = () => removeFromWishlist(item.id);

  const handleAddToCart = () => addToCart({ ...item, quantity: 1 });

  return (
    <div className="flex items-center border-t border-gray-3 py-5 px-10">
      <div className="min-w-[83px]">
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          onClick={handleRemoveFromWishlist}
          aria-label="Eliminar de la lista de deseos"
          className="h-9.5 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="min-w-[387px]">
        <div className="flex items-center justify-between gap-5">
          <div className="w-full flex items-center gap-5.5">
            <div className="flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5">
              <Image
                src={
                  item.primary_image_url ?? "/images/products/placeholder.png"
                }
                alt="product"
                width={200}
                height={200}
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

      <div className="min-w-[205px]">
        <p className="text-dark">${item.price}</p>
      </div>

      <div className="min-w-[265px]">
        <div className="flex items-center gap-1.5">
          <CircleAlert className="size-5 text-red" />

          <span className="text-red"> Out of Stock </span>
        </div>
      </div>

      <div className="min-w-[150px] flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          className="hover:bg-blue hover:text-white hover:border-blue"
        >
          Añadir al carrito
        </Button>
      </div>
    </div>
  );
};

export default SingleItem;

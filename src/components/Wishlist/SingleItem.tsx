import { Button } from "@/components/ui";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Trash2 } from "lucide-react";
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.99935 14.7917C10.3445 14.7917 10.6243 14.5119 10.6243 14.1667V9.16669C10.6243 8.82151 10.3445 8.54169 9.99935 8.54169C9.65417 8.54169 9.37435 8.82151 9.37435 9.16669V14.1667C9.37435 14.5119 9.65417 14.7917 9.99935 14.7917Z"
              fill="#F23030"
            />
            <path
              d="M9.99935 5.83335C10.4596 5.83335 10.8327 6.20645 10.8327 6.66669C10.8327 7.12692 10.4596 7.50002 9.99935 7.50002C9.53911 7.50002 9.16602 7.12692 9.16602 6.66669C9.16602 6.20645 9.53911 5.83335 9.99935 5.83335Z"
              fill="#F23030"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.04102 10C1.04102 5.05247 5.0518 1.04169 9.99935 1.04169C14.9469 1.04169 18.9577 5.05247 18.9577 10C18.9577 14.9476 14.9469 18.9584 9.99935 18.9584C5.0518 18.9584 1.04102 14.9476 1.04102 10ZM9.99935 2.29169C5.74215 2.29169 2.29102 5.74283 2.29102 10C2.29102 14.2572 5.74215 17.7084 9.99935 17.7084C14.2565 17.7084 17.7077 14.2572 17.7077 10C17.7077 5.74283 14.2565 2.29169 9.99935 2.29169Z"
              fill="#F23030"
            />
          </svg>

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

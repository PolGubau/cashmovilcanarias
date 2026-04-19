"use client";
import { Button, StarRating } from "@/components/ui";
import type { ProductFull } from "@/lib/supabase/types";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SingleListItem = ({ item }: { item: ProductFull }) => {
  const { openQuickView } = useUIStore();
  const addToCart = useCartStore((s) => s.addItem);
  const addToWishlist = useWishlistStore((s) => s.addItem);

  const handleQuickViewUpdate = () => openQuickView(item);

  const handleAddToCart = () =>
    addToCart({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price_from ?? 0,
      primary_image_url: item.primary_image_url,
      quantity: 1,
    });

  const handleItemToWishList = () =>
    addToWishlist({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: item.price_from ?? 0,
      primary_image_url: item.primary_image_url,
      quantity: 1,
    });

  return (
    <div className="group rounded-lg bg-white shadow-1">
      <div className="flex">
        <div className="shadow-list relative overflow-hidden flex items-center justify-center max-w-[270px] w-full sm:min-h-[270px] p-4">
          <Image
            src={item.primary_image_url ?? "/images/products/placeholder.png"}
            alt=""
            width={250}
            height={250}
          />

          <div className="absolute left-0 bottom-0 translate-y-full w-full flex items-center justify-center gap-2.5 pb-5 ease-linear duration-200 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="outline"
              onClick={handleQuickViewUpdate}
              aria-label="Vista rápida"
              className="rounded-[5px] border-0 bg-white shadow-1 hover:text-blue hover:bg-white"
            >
              <Eye className="size-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleAddToCart}
              className="rounded-[5px]"
            >
              Añadir al carrito
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={handleItemToWishList}
              aria-label="Añadir a favoritos"
              className="rounded-[5px] border-0 bg-white shadow-1 hover:text-blue hover:bg-white"
            >
              <Heart className="size-4" />
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center justify-center sm:justify-between py-5 px-4 sm:px-7.5 lg:pl-11 lg:pr-12">
          <div>
            <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5">
              <Link href={`/tienda/${item.id}`}> {item.name} </Link>
            </h3>

            <span className="flex items-center gap-2 font-medium text-lg">
              <span className="text-dark">${item.price_from ?? 0}</span>
            </span>
          </div>

          <StarRating
            rating={5}
            label={`(${item.variant_count} variante${item.variant_count !== 1 ? "s" : ""})`}
            className="mb-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleListItem;

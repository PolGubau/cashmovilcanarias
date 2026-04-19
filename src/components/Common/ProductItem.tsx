"use client";
import { Button } from "@/components/ui";
import type { ProductFull } from "@/lib/supabase/types";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductItem = ({ item }: { item: ProductFull }) => {
  const { openQuickView, openPreviewSlider } = useUIStore();
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

  const handleProductDetails = () => openPreviewSlider(item);

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4">
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

      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex items-center gap-1">
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/icons/icon-star.svg"
            alt="star icon"
            width={14}
            height={14}
          />
        </div>

        <p className="text-custom-sm">({item.variant_count} variante{item.variant_count !== 1 ? "s" : ""})</p>
      </div>

      <h3
        className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5"
        onClick={() => handleProductDetails()}
      >
        <Link href={`/tienda/${item.id}`}> {item.name} </Link>
      </h3>

      <span className="flex items-center gap-2 font-medium text-lg">
        <span className="text-dark">${item.price_from ?? 0}</span>
      </span>
    </div>
  );
};

export default ProductItem;

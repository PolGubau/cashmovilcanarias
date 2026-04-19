"use client";
import { Button } from "@/components/ui";
import { PRODUCT_CATEGORIES, type ProductFull } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Eye, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProductItem = ({ item }: { item: ProductFull }) => {
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

  const isOutOfStock = item.total_stock === 0;
  const isLastUnit = item.total_stock === 1;
  const categoryLabel = item.category ? PRODUCT_CATEGORIES[item.category] : null;

  return (
    <div className="group">
      <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-[#F6F7FB] min-h-[270px] mb-4">
        {/* Stock badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 left-3 z-10 text-2xs font-semibold bg-gray-4 text-white px-2 py-0.5 rounded">
            Sin stock
          </span>
        ) : isLastUnit ? (
          <span className="absolute top-3 left-3 z-10 text-2xs font-semibold bg-red text-white px-2 py-0.5 rounded">
            ¡Última unidad!
          </span>
        ) : null}

        <Image
          src={item.primary_image_url ?? "/images/products/placeholder.png"}
          alt={item.name}
          width={250}
          height={250}
        />

        {!isOutOfStock && (
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

            <Button size="sm" onClick={handleAddToCart} className="rounded-[5px]">
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
        )}
      </div>

      {/* Category + variants meta */}
      <div className="flex items-center gap-2 mb-1.5">
        {categoryLabel && (
          <span className="text-2xs font-medium text-blue bg-blue/10 px-1.5 py-0.5 rounded">
            {categoryLabel}
          </span>
        )}
        {item.variant_count > 1 && (
          <span className="text-custom-sm text-dark-4">
            {item.variant_count} opciones
          </span>
        )}
      </div>

      <h3 className="font-medium text-dark ease-out duration-200 hover:text-blue mb-1.5 leading-snug">
        <Link href={`/tienda/${item.id}`}>{item.name}</Link>
      </h3>

      <span className="font-semibold text-lg text-dark">
        {item.price_from != null ? `Desde ${formatCurrency(item.price_from)}` : "Consultar precio"}
      </span>
    </div>
  );
};

export default ProductItem;

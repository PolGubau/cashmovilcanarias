"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { ShieldCheck, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Variant {
  id: string;
  capacity: string | null;
  color: string | null;
  condition: string | null;
  battery_health: number | null;
  stock: number;
  price: number;
}

interface Props {
  variants: Variant[];
  conditionLabels: Record<string, string>;
  productId: string;
  productName: string;
  brand: string;
  primaryImageUrl: string | null;
}

export default function ProductVariantSelector({
  variants,
  conditionLabels,
  productId,
  productName,
  brand,
  primaryImageUrl,
}: Props) {
  const [selected, setSelected] = useState<Variant>(variants[0]);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function buildCartItem() {
    const variantLabel = [
      conditionLabels[selected.condition ?? ""] ?? selected.condition,
      selected.capacity,
      selected.color,
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      id: `${productId}-${selected.id}`,
      variantId: selected.id,
      name: `${productName}${variantLabel ? ` — ${variantLabel}` : ""}`,
      brand,
      price: selected.price,
      primary_image_url: primaryImageUrl,
      quantity: 1,
    };
  }

  function handleAddToCart() {
    addItem(buildCartItem());
    toast.success("Añadido al carrito");
  }

  function handleBuyNow() {
    addItem(buildCartItem());
    router.push("/cart");
  }

  return (
    <div className="space-y-5">
      {/* Variant cards */}
      <div className="space-y-2.5">
        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wider">
          Selecciona una opción
        </p>
        <div className="grid gap-2.5">
          {variants.map((v) => {
            const isSelected = selected.id === v.id;
            const label = [
              conditionLabels[v.condition ?? ""] ?? v.condition,
              v.capacity,
              v.color,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelected(v)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border-2 text-left transition-all active:scale-[0.99] ${isSelected
                    ? "border-blue bg-blue/5 shadow-sm"
                    : "border-gray-3 bg-white hover:border-gray-4 hover:bg-gray-1"
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Selection indicator */}
                  <span
                    className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-blue" : "border-gray-3"
                      }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-blue block" />
                    )}
                  </span>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-dark truncate">
                      {label}
                    </span>
                    {v.battery_health && (
                      <span className="text-xs text-dark-4 mt-0.5">
                        Batería {v.battery_health}%
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`shrink-0 text-base font-bold ml-3 ${isSelected ? "text-blue" : "text-dark"
                    }`}
                >
                  {formatCurrency(v.price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-4 py-3 border-y border-gray-3 text-xs text-dark-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-green shrink-0" /> Garantía incluida
        </span>
        <span className="flex items-center gap-1.5">
          <ShoppingCart className="h-4 w-4 text-blue shrink-0" /> Pago seguro
        </span>
      </div>

      {/* Price + CTAs */}
      <div className="space-y-3">
        <p className="text-2xl font-bold text-dark">
          {formatCurrency(selected.price)}
        </p>

        <div className="flex flex-col gap-3">
          <Button
            size="xl"
            className="w-full"
            leftIcon={<Zap className="h-5 w-5" />}
            onClick={handleBuyNow}
          >
            Comprar ahora
          </Button>
          <Button
            size="xl"
            variant="outline"
            className="w-full"
            leftIcon={<ShoppingCart className="h-5 w-5" />}
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </Button>
        </div>

        <p className="text-xs text-center text-dark-4">
          {selected.stock === 1
            ? "¡Última unidad!"
            : `${selected.stock} unidades disponibles`}
        </p>
      </div>
    </div>
  );
}

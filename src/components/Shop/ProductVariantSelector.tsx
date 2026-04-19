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
      {/* Variant grid */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-dark-3">Selecciona una opción</p>
        <div className="grid gap-2">
          {variants.map((v) => (
            <Button
              key={v.id}
              type="button"
              variant="ghost"
              onClick={() => setSelected(v)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left h-auto transition-all ${selected.id === v.id
                ? "border-blue bg-blue-light-5 ring-2 ring-blue/20"
                : "border-gray-3 bg-white hover:border-gray-4"
                }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-dark">
                  {[
                    conditionLabels[v.condition ?? ""] ?? v.condition,
                    v.capacity,
                    v.color,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                {v.battery_health && (
                  <span className="text-xs text-dark-4 mt-0.5">
                    Batería {v.battery_health}%
                  </span>
                )}
              </div>
              <span className="text-base font-bold text-dark">
                {formatCurrency(v.price)}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex items-center gap-4 py-3 border-y border-gray-3 text-xs text-dark-4">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-green" /> Garantía incluida
        </span>
        <span className="flex items-center gap-1.5">
          <ShoppingCart className="h-4 w-4 text-blue" /> Pago seguro
        </span>
      </div>

      {/* Price + CTAs */}
      <div>
        <p className="text-2xl font-bold text-dark mb-4">
          {formatCurrency(selected.price)}
        </p>
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            leftIcon={<ShoppingCart className="h-5 w-5" />}
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </Button>
          <Button
            size="lg"
            className="flex-1"
            leftIcon={<Zap className="h-5 w-5" />}
            onClick={handleBuyNow}
          >
            Comprar ahora
          </Button>
        </div>
        <p className="text-xs text-center text-dark-4 mt-3">
          {selected.stock === 1
            ? "¡Última unidad!"
            : `${selected.stock} unidades disponibles`}
        </p>
      </div>
    </div>
  );
}

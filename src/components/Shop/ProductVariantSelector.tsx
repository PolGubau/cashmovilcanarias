"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

interface Variant {
  id: string;
  capacity: string | null;
  color: string | null;
  condition: string | null;
  battery_health: number | null;
  stock: number;
  price: number;
  purchase_price: number | null;
}

interface Props {
  variants: Variant[];
  conditionLabels: Record<string, string>;
}

export default function ProductVariantSelector({ variants, conditionLabels }: Props) {
  const [selected, setSelected] = useState<Variant>(variants[0]);
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selected.price,
          metadata: { variant_id: selected.id, product_name: `${selected.capacity ?? ""} ${selected.color ?? ""}`.trim() },
        }),
      });
      const { clientSecret, error } = await res.json();
      if (error) throw new Error(error);
      // Redirect to checkout with clientSecret
      window.location.href = `/checkout?cs=${clientSecret}&amount=${selected.price}`;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Variant grid */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-dark-3">Selecciona una opción</p>
        <div className="grid gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelected(v)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${selected.id === v.id ? "border-blue bg-blue-light-5 ring-2 ring-blue/20" : "border-gray-3 bg-white hover:border-gray-4"}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-dark">
                  {[conditionLabels[v.condition ?? ""] ?? v.condition, v.capacity, v.color].filter(Boolean).join(" · ")}
                </span>
                {v.battery_health && (
                  <span className="text-xs text-dark-4 mt-0.5">Batería {v.battery_health}%</span>
                )}
              </div>
              <span className="text-base font-bold text-dark">{formatCurrency(v.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Margin info for selected */}
      {selected.purchase_price && (
        <p className="text-xs text-dark-4">
          Margen: {formatCurrency(selected.price - selected.purchase_price)} ({Math.round(((selected.price - selected.purchase_price) / selected.price) * 100)}%)
        </p>
      )}

      {/* CTA */}
      <Button
        size="xl"
        className="w-full"
        leftIcon={<ShoppingBag className="h-5 w-5" />}
        loading={loading}
        onClick={handleBuy}
      >
        Comprar por {formatCurrency(selected.price)}
      </Button>

      <p className="text-xs text-center text-dark-4">
        Pago seguro · {selected.stock} {selected.stock === 1 ? "unidad disponible" : "unidades disponibles"}
      </p>
    </div>
  );
}

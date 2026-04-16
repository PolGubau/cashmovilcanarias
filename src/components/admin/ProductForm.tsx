"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

const CONDITIONS = ["new", "excellent", "good", "fair"] as const;
const CONDITION_LABELS: Record<string, string> = { new: "Nuevo", excellent: "Excelente", good: "Bueno", fair: "Regular" };

type VariantRow = { capacity: string; color: string; condition: string; battery_health: string; stock: string; price: string; purchase_price: string; };
const emptyVariant = (): VariantRow => ({ capacity: "", color: "", condition: "excellent", battery_health: "", stock: "1", price: "", purchase_price: "" });

export default function ProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([emptyVariant()]);

  const updateVariant = (i: number, key: keyof VariantRow, val: string) =>
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [key]: val } : v));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await createProduct(
        {
          name:            fd.get("name") as string,
          brand:           fd.get("brand") as string,
          base_model:      fd.get("base_model") as string,
          description:     (fd.get("description") as string) || null,
          warranty_months: Number(fd.get("warranty_months") || 6),
          is_published:    false,
        },
        variants
          .filter((v) => v.price)
          .map((v) => ({
            product_id: "",
            capacity:        v.capacity || null,
            color:           v.color || null,
            condition:       (v.condition as any) || null,
            battery_health:  v.battery_health ? Number(v.battery_health) : null,
            stock:           Number(v.stock || 0),
            price:           Number(v.price),
            purchase_price:  v.purchase_price ? Number(v.purchase_price) : null,
            sku:             null,
            is_active:       true,
          })),
      );
      toast.success("Producto creado");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 mt-6">
      <Card>
        <CardHeader><CardTitle>Información del producto</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label htmlFor="name" required>Nombre</Label><Input id="name" name="name" placeholder="iPhone 13 Pro 128GB Negro" required className="mt-1.5" /></div>
          <div><Label htmlFor="brand" required>Marca</Label><Input id="brand" name="brand" placeholder="Apple" required className="mt-1.5" /></div>
          <div><Label htmlFor="base_model" required>Modelo base</Label><Input id="base_model" name="base_model" placeholder="iPhone 13 Pro" required className="mt-1.5" /></div>
          <div><Label htmlFor="warranty_months">Garantía (meses)</Label><Input id="warranty_months" name="warranty_months" type="number" defaultValue="6" min="0" max="36" className="mt-1.5" /></div>
          <div className="col-span-2"><Label htmlFor="description">Descripción</Label><Textarea id="description" name="description" placeholder="Descripción del producto..." rows={3} className="mt-1.5" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Variantes</CardTitle>
            <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setVariants((p) => [...p, emptyVariant()])}>Añadir variante</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 p-4 bg-gray-1 rounded-lg border border-gray-3 relative">
              {variants.length > 1 && (
                <button type="button" onClick={() => setVariants((p) => p.filter((_, idx) => idx !== i))} className="absolute top-3 right-3 text-dark-4 hover:text-red transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              )}
              <div><Label>Capacidad</Label><Input value={v.capacity} onChange={(e) => updateVariant(i, "capacity", e.target.value)} placeholder="128GB" className="mt-1" /></div>
              <div><Label>Color</Label><Input value={v.color} onChange={(e) => updateVariant(i, "color", e.target.value)} placeholder="Negro" className="mt-1" /></div>
              <div>
                <Label>Estado</Label>
                <select value={v.condition} onChange={(e) => updateVariant(i, "condition", e.target.value)} className="mt-1 w-full h-9 border border-gray-3 rounded-lg px-3 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue">
                  {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
                </select>
              </div>
              <div><Label>Batería %</Label><Input type="number" value={v.battery_health} onChange={(e) => updateVariant(i, "battery_health", e.target.value)} placeholder="85" min="0" max="100" className="mt-1" /></div>
              <div><Label required>Precio venta €</Label><Input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", e.target.value)} placeholder="299" required className="mt-1" /></div>
              <div><Label>Precio compra €</Label><Input type="number" value={v.purchase_price} onChange={(e) => updateVariant(i, "purchase_price", e.target.value)} placeholder="200" className="mt-1" /></div>
              <div><Label>Stock</Label><Input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} min="0" className="mt-1" /></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Guardar producto</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

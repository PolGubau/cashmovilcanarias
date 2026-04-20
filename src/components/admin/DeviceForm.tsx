"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDevice } from "@/lib/actions/devices";
import type { ProductOption, VariantOption } from "@/lib/actions/products";
import { getVariantsForSelect } from "@/lib/actions/products";
import type { Customer } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { Link2, Package, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const CONDITIONS = ["new", "excellent", "good", "fair", "poor", "parts_only"];
const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo", excellent: "Excelente", good: "Bueno", fair: "Regular", poor: "Malo", parts_only: "Solo piezas",
};

const selectCls = "w-full h-9 border border-gray-3 rounded-lg px-3 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";

interface Props {
  products: ProductOption[];
  suppliers?: Customer[];
}

export default function DeviceForm({ products, suppliers = [] }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");

  // Supplier combobox
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Customer | null>(null);
  const [supplierOpen, setSupplierOpen] = useState(false);

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter(
        (s) =>
          s.full_name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
          (s.phone ?? "").includes(supplierSearch),
      ),
    [suppliers, supplierSearch],
  );

  async function handleProductChange(productId: string) {
    setSelectedProductId(productId);
    setSelectedVariantId("");
    setVariants([]);
    if (!productId) return;
    setLoadingVariants(true);
    try {
      const v = await getVariantsForSelect(productId);
      setVariants(v);
    } finally {
      setLoadingVariants(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await createDevice({
        imei: form.get("imei") as string,
        imei2: (form.get("imei2") as string) || null,
        brand: form.get("brand") as string,
        model: form.get("model") as string,
        storage_gb: form.get("storage_gb") ? Number(form.get("storage_gb")) : null,
        color: (form.get("color") as string) || null,
        condition: form.get("condition") as any,
        status: "in_stock",
        cost_price: Number(form.get("cost_price")),
        purchase_date: form.get("purchase_date") as string,
        supplier_id: selectedSupplier?.id ?? null,
        purchase_invoice: (form.get("purchase_invoice") as string) || null,
        unlock_status: (form.get("unlock_status") as string) || null,
        battery_health: form.get("battery_health") ? Number(form.get("battery_health")) : null,
        notes: (form.get("notes") as string) || null,
        product_variant_id: selectedVariantId || null,
        sale_price: null, sold_at: null, buyer_id: null, images: null, created_by: null,
      });
      router.push("/admin/inventory");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="border border-red/30 bg-red/5 rounded-lg px-4 py-3 text-sm text-red">{error}</div>
      )}

      {/* Vinculación al catálogo */}
      <div className="bg-gray-1 border border-gray-3 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-dark-3" />
          <h2 className="text-[15px] font-medium text-dark-3">Vincular al catálogo de productos</h2>
          <span className="text-xs text-dark-4 ml-1">(opcional)</span>
        </div>
        <p className="text-sm text-dark-4">Al vincular, el stock de la tienda se actualiza automáticamente con este dispositivo.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="product">Producto</Label>
            <select value={selectedProductId} onChange={(e) => handleProductChange(e.target.value)} name="product" id="product" className={`${selectCls} mt-1.5`}>
              <option value="">— Sin vincular —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} · {p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="variant">Variante</Label>
            <select id="variant" value={selectedVariantId} onChange={(e) => setSelectedVariantId(e.target.value)} disabled={!selectedProductId || loadingVariants} className={`${selectCls} mt-1.5`}>
              <option value="">— Selecciona variante —</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {[v.capacity, v.color, v.condition].filter(Boolean).join(" · ")} — {formatCurrency(v.price)} ({v.device_stock} en stock)
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedVariant && (
          <div className="flex items-center gap-2 bg-white border border-gray-3 rounded-lg px-3 py-2">
            <Package className="size-3.5 text-dark-3 flex-shrink-0" />
            <span className="text-sm text-dark">
              Precio de venta: <strong>{formatCurrency(selectedVariant.price)}</strong> · Stock actual: <strong>{selectedVariant.device_stock} uds</strong>
            </span>
          </div>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Identificación</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imei" required>IMEI</Label>
            <Input id="imei" name="imei" placeholder="350000000000000" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="imei2">IMEI 2</Label>
            <Input id="imei2" name="imei2" placeholder="350000000000001" className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dispositivo</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand" required>Marca</Label>
              <Input id="brand" name="brand" placeholder="Apple" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="model" required>Modelo</Label>
              <Input id="model" name="model" placeholder="iPhone 13 Pro" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="storage_gb">Almacenamiento (GB)</Label>
              <Input id="storage_gb" name="storage_gb" type="number" placeholder="128" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Azul Sierra" className="mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="condition" required>Condición</Label>
              <select id="condition" name="condition" required className={`${selectCls} mt-1.5`}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="unlock_status">Estado SIM</Label>
              <select id="unlock_status" name="unlock_status" className={`${selectCls} mt-1.5`}>
                <option value="">Desconocido</option>
                <option value="unlocked">Libre</option>
                <option value="locked">Bloqueado</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="battery_health">Salud batería (%)</Label>
            <Input id="battery_health" name="battery_health" type="number" placeholder="85" className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Compra</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost_price" required>Precio de coste (€)</Label>
              <Input id="cost_price" name="cost_price" type="number" placeholder="0.00" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="purchase_date" required>Fecha de compra</Label>
              <Input id="purchase_date" name="purchase_date" type="date" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="purchase_invoice">Nº factura / referencia</Label>
              <Input id="purchase_invoice" name="purchase_invoice" placeholder="FAC-2024-001" className="mt-1.5" />
            </div>
          </div>

          {/* Supplier combobox */}
          <div className="relative">
            <Label htmlFor="supplier-search">Proveedor</Label>
            {selectedSupplier ? (
              <div className="flex items-center justify-between border border-gray-3 rounded-lg px-3 py-2.5 bg-gray-1 mt-1.5">
                <span className="text-sm text-dark">
                  {selectedSupplier.full_name}
                  {selectedSupplier.phone && <span className="text-dark-4 ml-2">{selectedSupplier.phone}</span>}
                </span>
                <button type="button" onClick={() => { setSelectedSupplier(null); setSupplierSearch(""); }}
                  aria-label="Quitar proveedor" className="text-dark-4 hover:text-dark">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <div className="relative mt-1.5">
                <Input
                  value={supplierSearch}
                  onChange={(e) => { setSupplierSearch(e.target.value); setSupplierOpen(true); }}
                  onFocus={() => setSupplierOpen(true)}
                  onBlur={() => setTimeout(() => setSupplierOpen(false), 150)}
                  placeholder="Buscar proveedor por nombre..."
                  id="supplier-search"
                  leftAddon={<Search className="size-4" />}
                />
                {supplierOpen && filteredSuppliers.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-3 rounded-lg shadow-2 max-h-48 overflow-auto">
                    {filteredSuppliers.map((s) => (
                      <li key={s.id}
                        onMouseDown={() => { setSelectedSupplier(s); setSupplierSearch(""); setSupplierOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-1">
                        <span className="font-medium text-dark">{s.full_name}</span>
                        {s.phone && <span className="text-dark-4">{s.phone}</span>}
                      </li>
                    ))}
                  </ul>
                )}
                {supplierOpen && suppliers.length === 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-3 rounded-lg px-3 py-2 text-sm text-dark-4">
                    No hay proveedores registrados. <a href="/admin/customers/new" className="text-blue underline">Crear uno</a>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
        <CardContent>
          <Textarea name="notes" rows={3} placeholder="Observaciones adicionales..." />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Registrar dispositivo</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}



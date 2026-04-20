"use client";

import { Button } from "@/components/ui/button";
import { createDevice } from "@/lib/actions/devices";
import type { ProductOption, VariantOption } from "@/lib/actions/products";
import { getVariantsForSelect } from "@/lib/actions/products";
import type { Customer } from "@/lib/supabase/types";
import { cn, formatCurrency } from "@/lib/utils";
import { Link2, Package, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const CONDITIONS = ["new", "excellent", "good", "fair", "poor", "parts_only"];
const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo", excellent: "Excelente", good: "Bueno", fair: "Regular", poor: "Malo", parts_only: "Solo piezas",
};

// Airbnb-style shared classes
const inputCls = "w-full border border-[#E6DECC] rounded-xl px-3 py-2.5 text-sm text-[#5C5955] bg-white placeholder:text-[#8F8F8F] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2] transition-colors";
const selectCls = cn(inputCls, "bg-white");

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
        <div className="border border-[#E25275]/30 bg-[#E25275]/5 rounded-xl px-4 py-3 text-sm text-[#E25275]">{error}</div>
      )}

      {/* Vinculación al catálogo */}
      <div className="bg-[#EEEBE4] border border-[#E6DECC] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="size-4 text-[#5C5955]" />
          <h2 className="text-[15px] font-medium text-[#5C5955]">Vincular al catálogo de productos</h2>
          <span className="text-xs text-[#8F8F8F] ml-1">(opcional)</span>
        </div>
        <p className="text-sm text-[#8F8F8F]">Al vincular, el stock de la tienda se actualiza automáticamente con este dispositivo.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#5C5955] mb-1.5">Producto</label>
            <select value={selectedProductId} onChange={(e) => handleProductChange(e.target.value)} className={selectCls}>
              <option value="">— Sin vincular —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.brand} · {p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C5955] mb-1.5">Variante</label>
            <select value={selectedVariantId} onChange={(e) => setSelectedVariantId(e.target.value)} disabled={!selectedProductId || loadingVariants} className={selectCls}>
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
          <div className="flex items-center gap-2 bg-white border border-[#E6DECC] rounded-xl px-3 py-2">
            <Package className="size-3.5 text-[#5C5955] flex-shrink-0" />
            <span className="text-sm text-[#5C5955]">
              Precio de venta: <strong>{formatCurrency(selectedVariant.price)}</strong> · Stock actual: <strong>{selectedVariant.device_stock} uds</strong>
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#E6DECC] p-6 space-y-4">
        <h2 className="text-[15px] font-medium text-[#5C5955] border-b border-[#E6DECC] pb-3">Identificación</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="imei" label="IMEI *" placeholder="350000000000000" required />
          <Field name="imei2" label="IMEI 2" placeholder="350000000000001" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E6DECC] p-6 space-y-4">
        <h2 className="text-[15px] font-medium text-[#5C5955] border-b border-[#E6DECC] pb-3">Dispositivo</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="brand" label="Marca *" placeholder="Apple" required />
          <Field name="model" label="Modelo *" placeholder="iPhone 13 Pro" required />
          <Field name="storage_gb" label="Almacenamiento (GB)" placeholder="128" type="number" />
          <Field name="color" label="Color" placeholder="Azul Sierra" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#5C5955] mb-1.5">Condición *</label>
            <select name="condition" required className={selectCls}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C5955] mb-1.5">Estado SIM</label>
            <select name="unlock_status" className={selectCls}>
              <option value="">Desconocido</option>
              <option value="unlocked">Libre</option>
              <option value="locked">Bloqueado</option>
            </select>
          </div>
        </div>
        <Field name="battery_health" label="Salud batería (%)" placeholder="85" type="number" />
      </div>

      <div className="bg-white rounded-xl border border-[#E6DECC] p-6 space-y-4">
        <h2 className="text-[15px] font-medium text-[#5C5955] border-b border-[#E6DECC] pb-3">Compra</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="cost_price" label="Precio de coste (€) *" placeholder="0.00" type="number" required />
          <Field name="purchase_date" label="Fecha de compra *" type="date" required />
          <Field name="purchase_invoice" label="Nº factura / referencia" placeholder="FAC-2024-001" />
        </div>

        {/* Supplier combobox */}
        <div className="relative">
          <label htmlFor="supplier-search" className="block text-sm font-medium text-[#5C5955] mb-1.5">Proveedor</label>
          {selectedSupplier ? (
            <div className="flex items-center justify-between border border-[#E6DECC] rounded-xl px-3 py-2.5 bg-[#EEEBE4]">
              <span className="text-sm text-[#5C5955]">
                {selectedSupplier.full_name}
                {selectedSupplier.phone && <span className="text-[#8F8F8F] ml-2">{selectedSupplier.phone}</span>}
              </span>
              <button type="button" onClick={() => { setSelectedSupplier(null); setSupplierSearch(""); }}
                aria-label="Quitar proveedor" className="text-[#8F8F8F] hover:text-[#5C5955]">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8F8F8F] pointer-events-none" />
              <input
                value={supplierSearch}
                onChange={(e) => { setSupplierSearch(e.target.value); setSupplierOpen(true); }}
                onFocus={() => setSupplierOpen(true)}
                onBlur={() => setTimeout(() => setSupplierOpen(false), 150)}
                placeholder="Buscar proveedor por nombre..."
                id="supplier-search"
                className={`${inputCls} pl-9`}
              />
              {supplierOpen && filteredSuppliers.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-[#E6DECC] rounded-xl shadow-sm max-h-48 overflow-auto">
                  {filteredSuppliers.map((s) => (
                    <li key={s.id}
                      onMouseDown={() => { setSelectedSupplier(s); setSupplierSearch(""); setSupplierOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#EEEBE4]">
                      <span className="font-medium text-[#5C5955]">{s.full_name}</span>
                      {s.phone && <span className="text-[#8F8F8F]">{s.phone}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {supplierOpen && suppliers.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#E6DECC] rounded-xl px-3 py-2 text-sm text-[#8F8F8F]">
                  No hay proveedores registrados. <a href="/admin/customers/new" className="text-[#5E6AD2] underline">Crear uno</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E6DECC] p-6">
        <h2 className="text-[15px] font-medium text-[#5C5955] border-b border-[#E6DECC] pb-3 mb-4">Notas</h2>
        <textarea name="notes" rows={3} placeholder="Observaciones adicionales..."
          className="w-full border border-[#E6DECC] rounded-xl px-3 py-2.5 text-sm text-[#5C5955] placeholder:text-[#8F8F8F] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2] resize-none transition-colors" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Registrar dispositivo</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

function Field({ name, label, placeholder, type = "text", required }: {
  name: string; label: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-[#5C5955] mb-1.5">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="w-full border border-[#E6DECC] rounded-xl px-3 py-2.5 text-sm text-[#5C5955] placeholder:text-[#8F8F8F] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/20 focus:border-[#5E6AD2] transition-colors" />
    </div>
  );
}

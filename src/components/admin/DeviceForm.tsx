"use client";

import { Button } from "@/components/ui/button";
import { getCustomers } from "@/lib/actions/customers";
import { createDevice } from "@/lib/actions/devices";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CONDITIONS = ["new", "excellent", "good", "fair", "poor", "parts_only"];
const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo", excellent: "Excelente", good: "Bueno", fair: "Regular", poor: "Malo", parts_only: "Solo piezas",
};

export default function DeviceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        supplier_id: (form.get("supplier_id") as string) || null,
        purchase_invoice: (form.get("purchase_invoice") as string) || null,
        unlock_status: (form.get("unlock_status") as string) || null,
        battery_health: form.get("battery_health") ? Number(form.get("battery_health")) : null,
        notes: (form.get("notes") as string) || null,
        sale_price: null,
        sold_at: null,
        buyer_id: null,
        images: null,
        created_by: null,
      });
      router.push("/admin/inventory");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-light-6 border border-red-light-4 rounded-lg px-4 py-3 text-sm text-red-dark">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Identificación</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="imei" label="IMEI *" placeholder="350000000000000" required />
          <Field name="imei2" label="IMEI 2" placeholder="350000000000001" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Dispositivo</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="brand" label="Marca *" placeholder="Apple" required />
          <Field name="model" label="Modelo *" placeholder="iPhone 13 Pro" required />
          <Field name="storage_gb" label="Almacenamiento (GB)" placeholder="128" type="number" />
          <Field name="color" label="Color" placeholder="Azul Sierra" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-3 mb-1.5">Condición *</label>
            <select name="condition" required className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue">
              {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-3 mb-1.5">Estado SIM</label>
            <select name="unlock_status" className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue">
              <option value="">Desconocido</option>
              <option value="unlocked">Libre</option>
              <option value="locked">Bloqueado</option>
            </select>
          </div>
        </div>
        <Field name="battery_health" label="Salud batería (%)" placeholder="85" type="number" />
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Compra</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field name="cost_price" label="Precio de coste (€) *" placeholder="0.00" type="number" required />
          <Field name="purchase_date" label="Fecha de compra *" type="date" required />
          <Field name="supplier_id" label="ID Proveedor (cliente)" placeholder="UUID del cliente" />
          <Field name="purchase_invoice" label="Nº factura / referencia" placeholder="FAC-2024-001" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4">Notas</h2>
        <textarea name="notes" rows={3} placeholder="Observaciones adicionales..."
          className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {loading ? "Guardando..." : "Registrar dispositivo"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({ name, label, placeholder, type = "text", required }: {
  name: string; label: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-dark-3 mb-1.5">{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder} required={required}
        className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
    </div>
  );
}

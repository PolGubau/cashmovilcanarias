"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PAYMENT_METHODS = ["cash", "card", "transfer", "bizum"];
const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo", card: "Tarjeta", transfer: "Transferencia", bizum: "Bizum",
};

export default function OrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState([{ device_id: "", price_sold: "" }]);

  function addItem() {
    setItems((prev) => [...prev, { device_id: "", price_sold: "" }]);
  }

  function removeItem(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      const orderItems = items
        .filter((item) => item.device_id && item.price_sold)
        .map((item) => ({ device_id: item.device_id, price_sold: Number(item.price_sold) }));

      if (orderItems.length === 0) throw new Error("Añade al menos un dispositivo");

      await createOrder(
        {
          customer_id: form.get("customer_id") as string,
          status: "confirmed",
          subtotal: 0,
          discount: Number(form.get("discount") || 0),
          total: 0,
          payment_method: (form.get("payment_method") as string) || null,
          payment_reference: (form.get("payment_reference") as string) || null,
          paid_at: null,
          notes: (form.get("notes") as string) || null,
          created_by: null,
        },
        orderItems
      );
      router.push("/admin/orders");
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
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Cliente</h2>
        <Field name="customer_id" label="ID de cliente *" placeholder="UUID del cliente" required />
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-3 pb-3">
          <h2 className="font-semibold text-dark">Dispositivos</h2>
          <Button type="button" variant="ghost" onClick={addItem}
            className="text-xs text-blue hover:underline font-medium px-0 h-auto">+ Añadir dispositivo</Button>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-3 mb-1.5">ID Dispositivo *</label>
              <input value={item.device_id} onChange={(e) => {
                const next = [...items]; next[i].device_id = e.target.value; setItems(next);
              }} placeholder="UUID del dispositivo (en stock)" required
                className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-dark-3 mb-1.5">Precio venta €</label>
              <input type="number" value={item.price_sold} onChange={(e) => {
                const next = [...items]; next[i].price_sold = e.target.value; setItems(next);
              }} placeholder="0.00" required
                className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue" />
            </div>
            {items.length > 1 && (
              <Button type="button" variant="ghost" onClick={() => removeItem(i)}
                className="text-red text-sm pb-2.5 hover:text-red-dark px-1 h-auto">✕</Button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Pago</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-3 mb-1.5">Método de pago</label>
            <select name="payment_method"
              className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue">
              <option value="">Seleccionar...</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{PAYMENT_LABELS[m]}</option>)}
            </select>
          </div>
          <Field name="payment_reference" label="Referencia de pago" placeholder="Nº transacción" />
          <Field name="discount" label="Descuento (€)" placeholder="0.00" type="number" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4">Notas</h2>
        <textarea name="notes" rows={2} placeholder="Observaciones..."
          className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {loading ? "Procesando..." : "Registrar venta"}
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

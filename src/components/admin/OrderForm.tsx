"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/orders";
import type { Customer, DeviceFull } from "@/lib/supabase/types";
import { Check, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const PAYMENT_METHODS = ["cash", "card", "transfer", "bizum"];
const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  bizum: "Bizum",
};

interface OrderFormProps {
  customers: Customer[];
  devices: DeviceFull[];
}

interface OrderItem {
  device: DeviceFull;
  price_sold: string;
}

export default function OrderForm({ customers, devices }: OrderFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [deviceSearch, setDeviceSearch] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [discount, setDiscount] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [notes, setNotes] = useState("");

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.full_name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          (c.phone ?? "").includes(customerSearch) ||
          (c.email ?? "").toLowerCase().includes(customerSearch.toLowerCase()),
      ),
    [customers, customerSearch],
  );

  const availableDevices = useMemo(() => {
    const addedIds = new Set(items.map((i) => i.device.id));
    return devices.filter(
      (d) =>
        !addedIds.has(d.id) &&
        (d.imei.includes(deviceSearch) ||
          `${d.brand} ${d.model}`.toLowerCase().includes(deviceSearch.toLowerCase())),
    );
  }, [devices, deviceSearch, items]);

  function addDevice(device: DeviceFull) {
    setItems((prev) => [
      ...prev,
      { device, price_sold: device.cost_price ? String(device.cost_price) : "" },
    ]);
    setDeviceSearch("");
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.device.id !== id));
  }

  function updatePrice(id: string, price: string) {
    setItems((prev) =>
      prev.map((i) => (i.device.id === id ? { ...i, price_sold: price } : i)),
    );
  }

  const subtotal = items.reduce((s, i) => s + Number(i.price_sold || 0), 0);
  const total = subtotal - Number(discount || 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) { setError("Selecciona un cliente"); return; }
    if (items.length === 0) { setError("Aniade al menos un dispositivo"); return; }

    setLoading(true);
    setError(null);
    try {
      await createOrder(
        {
          customer_id: selectedCustomer.id,
          status: "confirmed",
          subtotal,
          discount: Number(discount || 0),
          total,
          payment_method: paymentMethod || null,
          payment_reference: paymentRef || null,
          paid_at: null,
          notes: notes || null,
          created_by: null,
        },
        items.map((i) => ({ device_id: i.device.id, price_sold: Number(i.price_sold) })),
      );
      router.push("/admin/orders");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Customer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Cliente</h2>
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{selectedCustomer.full_name}</p>
              <p className="text-xs text-gray-500">{selectedCustomer.phone ?? selectedCustomer.email ?? "Sin contacto"}</p>
            </div>
            <button type="button" onClick={() => setSelectedCustomer(null)}
              className="text-gray-400 hover:text-gray-600 p-1">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setCustomerOpen(true); }}
                onFocus={() => setCustomerOpen(true)}
                placeholder="Buscar por nombre, telefono o email..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            {customerOpen && customerSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Sin resultados</p>
                ) : (
                  filteredCustomers.slice(0, 8).map((c) => (
                    <button key={c.id} type="button"
                      onClick={() => { setSelectedCustomer(c); setCustomerOpen(false); setCustomerSearch(""); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3">
                      <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold shrink-0">
                        {c.full_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.full_name}</p>
                        <p className="text-xs text-gray-400">{c.phone ?? c.email ?? ""}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Devices */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Dispositivos</h2>

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.device.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Check className="size-4 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.device.brand} {item.device.model}
                  </p>
                  <p className="text-xs font-mono text-gray-400">{item.device.imei}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm text-gray-500">EUR</span>
                  <input
                    type="number"
                    value={item.price_sold}
                    onChange={(e) => updatePrice(item.device.id, e.target.value)}
                    className="w-24 border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="0.00"
                  />
                </div>
                <button type="button" onClick={() => removeItem(item.device.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <div className="relative">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Aniadir dispositivo: busca por IMEI, marca o modelo..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          {deviceSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {availableDevices.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-400">Sin dispositivos en stock con ese criterio</p>
              ) : (
                availableDevices.slice(0, 8).map((d) => (
                  <button key={d.id} type="button" onClick={() => addDevice(d)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{d.brand} {d.model}</p>
                      <p className="text-xs font-mono text-gray-400">{d.imei}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {Number(d.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-900">
              {subtotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Pago</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-600 mb-1.5">Método de pago</label>
            <select value={paymentMethod} id="paymentMethod" onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="">Seleccionar...</option>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{PAYMENT_LABELS[m]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="payment-ref" className="block text-sm font-medium text-gray-600 mb-1.5">Referencia de pago</label>
            <input id="payment-ref" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="N transaccion"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-600 mb-1.5">Descuento (EUR)</label>
            <input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="flex items-end">
            <div className="w-full p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-0.5">Total a cobrar</p>
              <p className="text-lg font-bold text-gray-900">
                {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </p>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-600 mb-1.5">Notas</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            placeholder="Observaciones..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Registrar venta</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

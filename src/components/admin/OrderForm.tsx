"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/lib/actions/orders";
import type { Customer, DeviceFull } from "@/lib/supabase/types";
import { Check, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const selectCls = "w-full h-9 border border-gray-3 rounded-lg px-3 text-sm text-dark bg-white focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue";

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
        <div className="border border-red/30 bg-red/5 rounded-lg px-4 py-3 text-sm text-red">
          {error}
        </div>
      )}

      {/* Customer */}
      <Card>
        <CardHeader><CardTitle>Cliente</CardTitle></CardHeader>
        <CardContent>
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-3 bg-blue/5 border border-blue/20 rounded-lg">
              <div>
                <p className="font-medium text-dark">{selectedCustomer.full_name}</p>
                <p className="text-xs text-dark-4">{selectedCustomer.phone ?? selectedCustomer.email ?? "Sin contacto"}</p>
              </div>
              <button type="button" onClick={() => setSelectedCustomer(null)}
                className="text-dark-4 hover:text-dark p-1">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Input
                value={customerSearch}
                onChange={(e) => { setCustomerSearch(e.target.value); setCustomerOpen(true); }}
                onFocus={() => setCustomerOpen(true)}
                placeholder="Buscar por nombre, teléfono o email..."
                leftAddon={<Search className="size-4" />}
              />
              {customerOpen && customerSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-2 max-h-48 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-dark-4">Sin resultados</p>
                  ) : (
                    filteredCustomers.slice(0, 8).map((c) => (
                      <button key={c.id} type="button"
                        onClick={() => { setSelectedCustomer(c); setCustomerOpen(false); setCustomerSearch(""); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-1 flex items-center gap-3">
                        <div className="size-7 rounded-full bg-blue/10 text-blue flex items-center justify-center text-xs font-semibold shrink-0">
                          {c.full_name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-dark">{c.full_name}</p>
                          <p className="text-xs text-dark-4">{c.phone ?? c.email ?? ""}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Devices */}
      <Card>
        <CardHeader><CardTitle>Dispositivos</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.device.id}
                  className="flex items-center gap-3 p-3 bg-gray-1 rounded-lg border border-gray-3">
                  <Check className="size-4 text-green shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">
                      {item.device.brand} {item.device.model}
                    </p>
                    <p className="text-xs font-mono text-dark-4">{item.device.imei}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm text-dark-4">EUR</span>
                    <Input
                      type="number"
                      value={item.price_sold}
                      onChange={(e) => updatePrice(item.device.id, e.target.value)}
                      className="w-24 text-right"
                      placeholder="0.00"
                    />
                  </div>
                  <button type="button" onClick={() => removeItem(item.device.id)}
                    className="text-dark-5 hover:text-red transition-colors shrink-0">
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <Input
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Añadir dispositivo: busca por IMEI, marca o modelo..."
              leftAddon={<Plus className="size-4" />}
            />
            {deviceSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-3 rounded-lg shadow-2 max-h-48 overflow-y-auto">
                {availableDevices.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-dark-4">Sin dispositivos en stock con ese criterio</p>
                ) : (
                  availableDevices.slice(0, 8).map((d) => (
                    <button key={d.id} type="button" onClick={() => addDevice(d)}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-1 flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark">{d.brand} {d.model}</p>
                        <p className="text-xs font-mono text-dark-4">{d.imei}</p>
                      </div>
                      <span className="text-xs text-dark-4">
                        {Number(d.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="flex justify-between text-sm pt-2 border-t border-gray-3">
              <span className="text-dark-4">Subtotal</span>
              <span className="font-semibold text-dark">
                {subtotal.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment */}
      <Card>
        <CardHeader><CardTitle>Pago</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentMethod">Método de pago</Label>
              <select value={paymentMethod} id="paymentMethod" onChange={(e) => setPaymentMethod(e.target.value)}
                className={`${selectCls} mt-1.5`}>
                <option value="">Seleccionar...</option>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{PAYMENT_LABELS[m]}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="payment-ref">Referencia de pago</Label>
              <Input id="payment-ref" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Nº transacción" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="discount">Descuento (EUR)</Label>
              <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
                placeholder="0.00" className="mt-1.5" />
            </div>
            <div className="flex items-end">
              <div className="w-full p-3 bg-gray-1 rounded-lg">
                <p className="text-xs text-dark-4 mb-0.5">Total a cobrar</p>
                <p className="text-lg font-bold text-dark">
                  {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </p>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              placeholder="Observaciones..." className="mt-1.5" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Registrar venta</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

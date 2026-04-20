"use client";

import { Button } from "@/components/ui/button";
import { createRepair } from "@/lib/actions/repairs";
import type { Customer, DeviceFull } from "@/lib/supabase/types";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface RepairFormProps {
  customers: Customer[];
  inventoryDevices: DeviceFull[];
}

export default function RepairForm({ customers, inventoryDevices }: RepairFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer combobox
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOpen, setCustomerOpen] = useState(false);

  // Inventory device (optional link)
  const [deviceSearch, setDeviceSearch] = useState("");
  const [linkedDevice, setLinkedDevice] = useState<DeviceFull | null>(null);

  // Manual device fields (for external devices not in inventory)
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [imei, setImei] = useState("");

  // Repair fields
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deposit, setDeposit] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");
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

  const filteredDevices = useMemo(
    () =>
      inventoryDevices.filter(
        (d) =>
          d.imei.includes(deviceSearch) ||
          `${d.brand} ${d.model}`.toLowerCase().includes(deviceSearch.toLowerCase()),
      ),
    [inventoryDevices, deviceSearch],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCustomer) { setError("Selecciona un cliente"); return; }
    if (!description.trim()) { setError("Describe el problema"); return; }

    setLoading(true);
    setError(null);
    try {
      await createRepair({
        device_id: linkedDevice?.id ?? null,
        customer_id: selectedCustomer.id,
        device_brand: linkedDevice ? linkedDevice.brand : brand || null,
        device_model: linkedDevice ? linkedDevice.model : model || null,
        device_imei: linkedDevice ? linkedDevice.imei : imei || null,
        status: "received",
        description,
        diagnosis: null,
        solution: null,
        parts_used: null,
        budget: budget ? Number(budget) : null,
        cost: null,
        deposit_paid: Number(deposit || 0),
        warranty_days: 90,
        warranty_expires_at: null,
        received_at: new Date().toISOString(),
        diagnosed_at: null,
        completed_at: null,
        delivered_at: null,
        estimated_ready_at: estimatedDate || null,
        assigned_to: null,
        created_by: null,
        notes: notes || null,
      });
      router.push("/admin/repairs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Customer */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Cliente *</h2>
        {selectedCustomer ? (
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{selectedCustomer.full_name}</p>
              <p className="text-xs text-gray-500">{selectedCustomer.phone ?? selectedCustomer.email ?? ""}</p>
            </div>
            <button type="button" onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input value={customerSearch}
              onChange={(e) => { setCustomerSearch(e.target.value); setCustomerOpen(true); }}
              onFocus={() => setCustomerOpen(true)}
              placeholder="Buscar cliente por nombre, telefono o email..."
              className={`${inputCls} pl-9`}
            />
            {customerOpen && customerSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Sin resultados</p>
                ) : filteredCustomers.slice(0, 8).map((c) => (
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
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Device */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Dispositivo</h2>
        {linkedDevice ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{linkedDevice.brand} {linkedDevice.model}</p>
              <p className="text-xs font-mono text-gray-400">{linkedDevice.imei}</p>
            </div>
            <button type="button" onClick={() => setLinkedDevice(null)} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input value={deviceSearch} onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Vincular a inventario (busca por IMEI o modelo)..."
              className={`${inputCls} pl-9`}
            />
            {deviceSearch && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredDevices.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">Sin coincidencias en inventario</p>
                ) : filteredDevices.slice(0, 8).map((d) => (
                  <button key={d.id} type="button" onClick={() => { setLinkedDevice(d); setDeviceSearch(""); setBrand(d.brand); setModel(d.model); setImei(d.imei); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{d.brand} {d.model}</p>
                      <p className="text-xs font-mono text-gray-400">{d.imei}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-gray-400">O introduce los datos manualmente si el dispositivo es externo:</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Marca</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Samsung" className={inputCls} disabled={!!linkedDevice} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Modelo</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Galaxy S23" className={inputCls} disabled={!!linkedDevice} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">IMEI</label>
            <input value={imei} onChange={(e) => setImei(e.target.value)} placeholder="350000000000000" className={inputCls} disabled={!!linkedDevice} />
          </div>
        </div>
      </div>

      {/* Problem & budget */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-3">Averia y presupuesto</h2>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Descripcion del problema *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
            placeholder="El cliente indica que la pantalla no enciende..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Presupuesto (EUR)</label>
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Senal recibida (EUR)</label>
            <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0.00" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lista estimada</label>
            <input type="date" value={estimatedDate} onChange={(e) => setEstimatedDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Notas internas</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observaciones del tecnico..." className={inputCls} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Crear reparacion</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
      </div>
    </form>
  );
}

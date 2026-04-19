"use client";

import { Button } from "@/components/ui/button";
import { createRepair } from "@/lib/actions/repairs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RepairForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await createRepair({
        device_id: (form.get("device_id") as string) || null,
        customer_id: form.get("customer_id") as string,
        device_brand: (form.get("device_brand") as string) || null,
        device_model: (form.get("device_model") as string) || null,
        device_imei: (form.get("device_imei") as string) || null,
        status: "received",
        description: form.get("description") as string,
        diagnosis: null,
        solution: null,
        parts_used: null,
        budget: form.get("budget") ? Number(form.get("budget")) : null,
        cost: null,
        deposit_paid: Number(form.get("deposit_paid") || 0),
        warranty_days: 90,
        warranty_expires_at: null,
        received_at: new Date().toISOString(),
        diagnosed_at: null,
        completed_at: null,
        delivered_at: null,
        estimated_ready_at: (form.get("estimated_ready_at") as string) || null,
        assigned_to: null,
        created_by: null,
        notes: (form.get("notes") as string) || null,
      });
      router.push("/admin/repairs");
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
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Dispositivo</h2>
        <p className="text-xs text-dark-4">Si el dispositivo está en inventario, usa el ID. Si es externo, rellena marca/modelo/IMEI.</p>
        <Field name="device_id" label="ID dispositivo (inventario)" placeholder="UUID - opcional" />
        <div className="grid grid-cols-3 gap-4">
          <Field name="device_brand" label="Marca" placeholder="Samsung" />
          <Field name="device_model" label="Modelo" placeholder="Galaxy S23" />
          <Field name="device_imei" label="IMEI" placeholder="350000000000000" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Avería y presupuesto</h2>
        <div>
          <label className="block text-sm font-medium text-dark-3 mb-1.5">Descripción del problema *</label>
          <textarea name="description" required rows={3} placeholder="El cliente indica que la pantalla no enciende..."
            className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field name="budget" label="Presupuesto (€)" placeholder="0.00" type="number" />
          <Field name="deposit_paid" label="Señal recibida (€)" placeholder="0.00" type="number" />
          <Field name="estimated_ready_at" label="Lista estimada" type="date" />
        </div>
        <Field name="notes" label="Notas internas" placeholder="Observaciones del técnico..." />
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {loading ? "Guardando..." : "Crear reparación"}
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

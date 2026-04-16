"use client";

import { createCustomer } from "@/lib/actions/customers";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupplier, setIsSupplier] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    try {
      await createCustomer({
        user_id: null,
        full_name: form.get("full_name") as string,
        phone: (form.get("phone") as string) || null,
        email: (form.get("email") as string) || null,
        dni: (form.get("dni") as string) || null,
        address: (form.get("address") as string) || null,
        city: (form.get("city") as string) || null,
        postal_code: (form.get("postal_code") as string) || null,
        notes: (form.get("notes") as string) || null,
        is_supplier: isSupplier,
      });
      router.push("/admin/customers");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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

      {/* Type toggle */}
      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4">Tipo de contacto</h2>
        <div className="flex gap-3">
          {[
            { value: false, label: "Cliente (comprador)" },
            { value: true, label: "Proveedor (vendedor)" },
          ].map(({ value, label }) => (
            <button key={String(value)} type="button"
              onClick={() => setIsSupplier(value)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${isSupplier === value ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Datos personales</h2>
        <Field name="full_name" label="Nombre completo *" placeholder="Ana García López" required />
        <div className="grid grid-cols-2 gap-4">
          <Field name="phone" label="Teléfono" placeholder="+34 600 000 000" />
          <Field name="email" label="Email" placeholder="ana@email.com" type="email" />
          <Field name="dni" label="DNI / NIE" placeholder="12345678A" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6 space-y-4">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3">Dirección</h2>
        <Field name="address" label="Dirección" placeholder="Calle Mayor 1" />
        <div className="grid grid-cols-2 gap-4">
          <Field name="city" label="Ciudad" placeholder="Las Palmas" />
          <Field name="postal_code" label="Código postal" placeholder="35001" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4">Notas</h2>
        <textarea name="notes" rows={3} placeholder="Observaciones..."
          className="w-full border border-gray-3 rounded-lg px-3 py-2.5 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none" />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="bg-blue text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-dark transition-colors disabled:opacity-50">
          {loading ? "Guardando..." : "Registrar contacto"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="bg-white text-dark-3 text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-3 hover:bg-gray-1 transition-colors">
          Cancelar
        </button>
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

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        <div className="border border-red/30 bg-red/5 rounded-lg px-4 py-3 text-sm text-red">
          {error}
        </div>
      )}

      {/* Type toggle */}
      <Card>
        <CardHeader><CardTitle>Tipo de contacto</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {[
              { value: false, label: "Cliente (comprador)" },
              { value: true, label: "Proveedor (vendedor)" },
            ].map(({ value, label }) => (
              <button
                key={String(value)}
                type="button"
                onClick={() => setIsSupplier(value)}
                className={`flex-1 py-2.5 text-sm rounded-lg border transition-colors font-medium ${isSupplier === value
                  ? "bg-dark text-white border-dark"
                  : "bg-white text-dark-4 border-gray-3 hover:bg-gray-1 hover:text-dark"
                  }`}>
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="full_name" required>Nombre completo</Label>
            <Input id="full_name" name="full_name" placeholder="Ana García López" required className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" placeholder="+34 600 000 000" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="ana@email.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="dni">DNI / NIE</Label>
              <Input id="dni" name="dni" placeholder="12345678A" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Dirección</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" placeholder="Calle Mayor 1" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" name="city" placeholder="Las Palmas" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="postal_code">Código postal</Label>
              <Input id="postal_code" name="postal_code" placeholder="35001" className="mt-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Notas</CardTitle></CardHeader>
        <CardContent>
          <Textarea name="notes" rows={3} placeholder="Observaciones..." />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {loading ? "Guardando..." : "Registrar contacto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}



"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/lib/actions/auth";
import { Smartphone } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      await signIn(fd.get("email") as string, fd.get("password") as string);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Credenciales incorrectas");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-1 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-dark rounded-2xl mb-4">
            <Smartphone className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-dark">CashMóvil Canarias</h1>
          <p className="text-sm text-dark-4 mt-1">Panel de gestión</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-3 shadow-1 p-6">
          <h2 className="text-base font-semibold text-dark mb-5">Iniciar sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" required>Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@cashmovil.com"
                required
                autoComplete="email"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password" required>Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="mt-1.5"
              />
            </div>

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Entrar
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-dark-5 mt-6">
          Acceso restringido a personal autorizado
        </p>
      </div>
    </div>
  );
}

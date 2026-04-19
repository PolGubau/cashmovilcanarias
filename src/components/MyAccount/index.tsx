"use client";

import { Button, FormField, Input } from "@/components/ui";
import { updateProfile } from "@/lib/actions/auth";
import { signOut } from "@/lib/actions/auth";
import type { OrderFull, Repair } from "@/lib/supabase/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LayoutDashboard, LogOut, Package, User, Wrench } from "lucide-react";
import type React from "react";
import { useTransition } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import Breadcrumb from "../Common/Breadcrumb";
import StatusBadge from "../admin/StatusBadge";

interface MyAccountProps {
  user: { name: string; email: string };
  orders: OrderFull[];
  repairs: Repair[];
}

type Tab = "dashboard" | "orders" | "repairs" | "account-details";

const TAB_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "dashboard",
    label: "Resumen",
    icon: <LayoutDashboard className="size-[20px]" />,
  },
  {
    id: "orders",
    label: "Mis pedidos",
    icon: <Package className="size-[20px]" />,
  },
  {
    id: "repairs",
    label: "Mis reparaciones",
    icon: <Wrench className="size-[20px]" />,
  },
  {
    id: "account-details",
    label: "Mis datos",
    icon: <User className="size-[20px]" />,
  },
];

const MyAccount = ({ user, orders, repairs }: MyAccountProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isPending, startTransition] = useTransition();

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile({
        full_name: fd.get("full_name") as string,
        phone: (fd.get("phone") as string) || undefined,
      });
      if (result.error) toast.error(result.error);
      else toast.success("Datos actualizados correctamente");
    });
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const tabClass = (id: Tab) =>
    `w-full justify-start gap-2.5 py-3 px-4.5 rounded-md ${activeTab === id
      ? "bg-blue text-white hover:bg-blue hover:text-white"
      : "text-dark-2 bg-gray-1 hover:bg-blue hover:text-white"
    }`;

  return (
    <>
      <Breadcrumb title="Mi cuenta" pages={["mi cuenta"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5">

            {/* ── Sidebar ─────────────────────────────────────────────────── */}
            <div className="xl:max-w-[370px] w-full bg-white rounded-xl shadow-1">
              <div className="flex xl:flex-col">
                {/* Avatar + info */}
                <div className="hidden lg:flex flex-wrap items-center gap-4 py-6 px-4 sm:px-7.5 xl:px-9 border-r xl:border-r-0 xl:border-b border-gray-3">
                  <div className="size-16 rounded-full bg-blue flex items-center justify-center text-white font-semibold text-lg shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-dark mb-0.5 truncate">{user.name}</p>
                    <p className="text-custom-xs text-dark-4 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Nav */}
                <div className="p-4 sm:p-7.5 xl:p-9 w-full">
                  <div className="flex flex-wrap xl:flex-nowrap xl:flex-col gap-3">
                    {TAB_ITEMS.map((t) => (
                      <Button
                        key={t.id}
                        type="button"
                        variant="ghost"
                        onClick={() => setActiveTab(t.id)}
                        className={tabClass(t.id)}
                      >
                        {t.icon}
                        {t.label}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => signOut("/signin")}
                      className="w-full justify-start gap-2.5 py-3 px-4.5 rounded-md text-red bg-red-light-6 hover:bg-red hover:text-white mt-2"
                    >
                      <LogOut className="size-5" />
                      Cerrar sesión
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            {/* ── Dashboard ───────────────────────────────────────────────── */}
            <div className={`xl:max-w-[770px] w-full ${activeTab === "dashboard" ? "block" : "hidden"}`}>
              <div className="bg-white rounded-xl shadow-1 py-9.5 px-4 sm:px-7.5 xl:px-10 mb-6">
                <h2 className="font-semibold text-lg text-dark mb-1">
                  ¡Hola, {user.name.split(" ")[0]}!
                </h2>
                <p className="text-custom-sm text-dark-4">
                  Desde aquí puedes consultar tus pedidos y reparaciones, y editar tus datos personales.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="bg-white rounded-xl shadow-1 p-6 text-left hover:shadow-md transition-shadow"
                >
                  <Package className="size-8 text-blue mb-3" />
                  <p className="font-semibold text-dark text-2xl">{orders.length}</p>
                  <p className="text-sm text-dark-4 mt-1">Pedidos realizados</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("repairs")}
                  className="bg-white rounded-xl shadow-1 p-6 text-left hover:shadow-md transition-shadow"
                >
                  <Wrench className="size-8 text-blue mb-3" />
                  <p className="font-semibold text-dark text-2xl">{repairs.length}</p>
                  <p className="text-sm text-dark-4 mt-1">Reparaciones</p>
                </button>
              </div>
            </div>
            {/* ── Mis pedidos ─────────────────────────────────────────────── */}
            <div className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 ${activeTab === "orders" ? "block" : "hidden"}`}>
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <h3 className="font-semibold text-dark">Mis pedidos</h3>
              </div>
              {orders.length === 0 ? (
                <p className="py-10 px-7 text-dark-4 text-sm">Aún no tienes pedidos registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-3 text-dark-4 text-xs">
                      <tr>
                        <th className="py-3 px-5 text-left font-medium">Nº pedido</th>
                        <th className="py-3 px-5 text-left font-medium">Fecha</th>
                        <th className="py-3 px-5 text-left font-medium">Estado</th>
                        <th className="py-3 px-5 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-3">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-1 transition-colors">
                          <td className="py-3.5 px-5 text-dark font-medium">{o.invoice_number ?? `#${o.id.slice(0, 8)}`}</td>
                          <td className="py-3.5 px-5 text-dark-4">{formatDate(o.created_at)}</td>
                          <td className="py-3.5 px-5"><StatusBadge status={o.status} type="order" /></td>
                          <td className="py-3.5 px-5 text-right font-medium text-dark">{formatCurrency(o.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* ── Mis reparaciones ────────────────────────────────────────── */}
            <div className={`xl:max-w-[770px] w-full bg-white rounded-xl shadow-1 ${activeTab === "repairs" ? "block" : "hidden"}`}>
              <div className="py-5 px-4 sm:px-7.5 border-b border-gray-3">
                <h3 className="font-semibold text-dark">Mis reparaciones</h3>
              </div>
              {repairs.length === 0 ? (
                <p className="py-10 px-7 text-dark-4 text-sm">Aún no tienes reparaciones registradas.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-3 text-dark-4 text-xs">
                      <tr>
                        <th className="py-3 px-5 text-left font-medium">Dispositivo</th>
                        <th className="py-3 px-5 text-left font-medium">Problema</th>
                        <th className="py-3 px-5 text-left font-medium">Estado</th>
                        <th className="py-3 px-5 text-left font-medium">Recibido</th>
                        <th className="py-3 px-5 text-right font-medium">Coste</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-3">
                      {repairs.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-1 transition-colors">
                          <td className="py-3.5 px-5 text-dark">{r.device_description ?? "—"}</td>
                          <td className="py-3.5 px-5 text-dark-4 max-w-[160px] truncate">{r.issue}</td>
                          <td className="py-3.5 px-5"><StatusBadge status={r.status} type="repair" /></td>
                          <td className="py-3.5 px-5 text-dark-4">{formatDate(r.received_at)}</td>
                          <td className="py-3.5 px-5 text-right font-medium text-dark">{r.cost != null ? formatCurrency(r.cost) : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Mis datos ───────────────────────────────────────────────── */}
            <div className={`xl:max-w-[770px] w-full ${activeTab === "account-details" ? "block" : "hidden"}`}>
              <form onSubmit={handleProfileSubmit}>
                <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
                  <h3 className="font-semibold text-dark mb-5">Datos personales</h3>

                  <div className="flex flex-col gap-5 mb-5">
                    <FormField label="Nombre completo" htmlFor="full_name" required>
                      <Input
                        type="text"
                        name="full_name"
                        id="full_name"
                        defaultValue={user.name}
                        autoComplete="name"
                        className="py-2.5 px-5 h-auto"
                      />
                    </FormField>

                    <FormField label="Teléfono" htmlFor="phone">
                      <Input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="+34 600 000 000"
                        autoComplete="tel"
                        className="py-2.5 px-5 h-auto"
                      />
                    </FormField>

                    <FormField label="Correo electrónico" htmlFor="email_ro">
                      <Input
                        type="email"
                        id="email_ro"
                        value={user.email}
                        disabled
                        className="py-2.5 px-5 h-auto"
                      />
                    </FormField>
                  </div>

                  <p className="text-custom-xs text-dark-4 mb-5">
                    El correo electrónico no se puede cambiar desde aquí. Contacta con soporte si necesitas actualizarlo.
                  </p>

                  <Button type="submit" loading={isPending}>
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default MyAccount;

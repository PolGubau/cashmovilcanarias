"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import type { UserRole } from "@/lib/supabase/types";
import {
  BarChart3, ClipboardList, LayoutDashboard, LogOut, Menu, Package,
  ShieldCheck, ShoppingCart, Smartphone, Users, Wrench, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navGroups = [
  {
    label: "Gestión",
    items: [
      { href: "/admin", label: "Panel principal", icon: LayoutDashboard, exact: true },
      { href: "/admin/inventory", label: "Inventario", icon: Smartphone },
      { href: "/admin/repairs", label: "Reparaciones", icon: Wrench },
      { href: "/admin/orders", label: "Ventas", icon: ShoppingCart },
      { href: "/admin/customers", label: "Clientes", icon: Users },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { href: "/admin/products", label: "Productos", icon: Package },
    ],
  },
  {
    label: "Análisis",
    items: [
      { href: "/admin/stats", label: "Estadísticas", icon: BarChart3 },
      { href: "/admin/audit", label: "Auditoría", icon: ClipboardList },
    ],
  },
];

export default function AdminSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue rounded-xl flex items-center justify-center shadow-sm">
            <Smartphone className="size-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[13px] text-gray-900 leading-tight">CashMóvil</p>
            <p className="text-[11px] text-gray-400">Canarias · Admin</p>
          </div>
        </div>
        {/* Close button — only visible on mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, exact }) => {
                const isActive = exact
                  ? pathname === href
                  : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${isActive
                      ? "bg-blue/8 text-blue border border-blue/12"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                      }`}
                  >
                    <Icon className={`size-4 flex-shrink-0 ${isActive ? "text-blue" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Sistema — solo visible para admin */}
        {role === "admin" && (
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
              Sistema
            </p>
            <div className="space-y-0.5">
              {(() => {
                const href = "/admin/users";
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    href={href}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${isActive
                      ? "bg-blue/8 text-blue border border-blue/12"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                      }`}
                  >
                    <ShieldCheck className={`size-4 shrink-0 ${isActive ? "text-blue" : "text-gray-400 group-hover:text-gray-600"}`} />
                    Usuarios
                  </Link>
                );
              })()}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <form action={() => signOut("/admin/login")}>
          <Button
            type="submit"
            variant="ghost"
            className="group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 justify-start h-auto"
          >
            <LogOut className="size-4 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-200 shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          role="presentation"
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible | mobile: drawer */}
      <aside
        className={`fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

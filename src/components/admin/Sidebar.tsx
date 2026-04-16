"use client";

import { signOut } from "@/lib/actions/auth";
import {
  BarChart3, ClipboardList, LayoutDashboard, LogOut, Package,
  ShoppingCart, Smartphone, Users, Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Brand */}
      <div className="h-16 px-5 flex items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue rounded-xl flex items-center justify-center shadow-sm">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-[13px] text-gray-900 leading-tight">CashMóvil</p>
            <p className="text-[11px] text-gray-400">Canarias · Admin</p>
          </div>
        </div>
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
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue" : "text-gray-400 group-hover:text-gray-600"}`} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <form action={signOut}>
          <button
            type="submit"
            className="group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-red-500" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

"use client";

import { signOut } from "@/lib/actions/auth";
import {
  BarChart3, ClipboardList, LayoutDashboard, LogOut, Package, ShoppingCart,
  Smartphone, Users, Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Catálogo", icon: Package },
  { href: "/admin/inventory", label: "Inventario", icon: Smartphone },
  { href: "/admin/repairs", label: "Reparaciones", icon: Wrench },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/orders", label: "Ventas", icon: ShoppingCart },
  { href: "/admin/audit", label: "Auditoría", icon: ClipboardList },
  { href: "/admin/stats", label: "Estadísticas", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark text-white flex flex-col z-50">
      <div className="p-6 border-b border-dark-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">CashMóvil</p>
            <p className="text-xs text-dark-4">Canarias</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive
                  ? "bg-blue text-white"
                  : "text-dark-4 hover:bg-dark-2 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-dark-2">
        <form action={signOut}>
          <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-4 hover:bg-dark-2 hover:text-white transition-colors w-full">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

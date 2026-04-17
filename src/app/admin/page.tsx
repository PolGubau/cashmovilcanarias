import StatsCard from "@/components/admin/StatsCard";
import { getInventoryStats } from "@/lib/actions/devices";
import { getOrderStats } from "@/lib/actions/orders";
import type { InventoryStatusView } from "@/lib/supabase/types";
import { ArrowRight, Package, ShoppingCart, Smartphone, TrendingUp, Users, Wrench } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [inventoryStats, orderStats] = await Promise.all([
    getInventoryStats().catch((): InventoryStatusView[] => []),
    getOrderStats().catch(() => ({ total_orders: 0, completed: 0, pending: 0, revenue: 0 })),
  ]);

  const statsMap = Object.fromEntries(
    (inventoryStats ?? []).map((s) => [s.status, s])
  );

  const inStock = statsMap.in_stock?.count ?? 0;
  const inRepair = statsMap.in_repair?.count ?? 0;
  const reserved = statsMap.reserved?.count ?? 0;
  const totalStock = Object.values(statsMap).reduce((sum, v) => sum + (v?.count ?? 0), 0);

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const statusLabels: Record<string, string> = {
    purchased: "Comprado", in_stock: "En stock", reserved: "Reservado",
    sold: "Vendido", in_repair: "En reparación", returned: "Devuelto", written_off: "Dado de baja",
  };

  const quickActions = [
    { href: "/admin/inventory/new", label: "Registrar nuevo dispositivo", icon: Smartphone, color: "bg-blue/10 text-blue" },
    { href: "/admin/repairs/new", label: "Abrir reparación", icon: Wrench, color: "bg-orange/10 text-orange-dark" },
    { href: "/admin/customers/new", label: "Añadir cliente", icon: Users, color: "bg-purple-100 text-purple-700" },
    { href: "/admin/orders/new", label: "Registrar venta", icon: ShoppingCart, color: "bg-green/10 text-green-dark" },
    { href: "/admin/products/new", label: "Crear producto", icon: Package, color: "bg-yellow/10 text-yellow-dark" },
  ];

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Panel principal</h1>
        <p className="text-[13px] text-gray-400 mt-0.5 capitalize">{today}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Móviles en stock" value={inStock} subtitle={`${totalStock} total registrados`} icon={Smartphone} color="blue" />
        <StatsCard title="En reparación" value={inRepair} subtitle={`${reserved} reservados`} icon={Wrench} color="orange" />
        <StatsCard title="Ventas completadas" value={orderStats.completed} subtitle={`${orderStats.pending} pendientes`} icon={ShoppingCart} color="green" />
        <StatsCard
          title="Ingresos totales"
          value={orderStats.revenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          subtitle={`${orderStats.total_orders} pedidos en total`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Inventory breakdown */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[14px] font-semibold text-gray-800">Estado del inventario</h2>
            <Link href="/admin/inventory" className="text-[12px] text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
              Ver todo <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {(inventoryStats ?? []).map((s) => {
              const pct = totalStock > 0 ? Math.round((s.count / totalStock) * 100) : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-gray-600">{statusLabels[s.status] ?? s.status}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-semibold text-gray-800">{s.count} uds</span>
                      <span className="text-[12px] text-gray-400 w-24 text-right">
                        {Number(s.total_cost).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue/60 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {inventoryStats?.length === 0 && (
              <p className="text-[13px] text-gray-400 py-4 text-center">Sin datos de inventario aún</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <h2 className="text-[14px] font-semibold text-gray-800 mb-5">Acciones rápidas</h2>
          <div className="space-y-1.5">
            {quickActions.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 group transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-gray-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Smartphone, Wrench, ShoppingCart, TrendingUp, AlertCircle, Clock } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import PageHeader from "@/components/admin/PageHeader";
import { getInventoryStats } from "@/lib/actions/devices";
import { getOrderStats } from "@/lib/actions/orders";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [inventoryStats, orderStats] = await Promise.all([
    getInventoryStats().catch(() => []),
    getOrderStats().catch(() => ({ total_orders: 0, completed: 0, pending: 0, revenue: 0 })),
  ]);

  const statsMap = Object.fromEntries(
    (inventoryStats ?? []).map((s: any) => [s.status, s])
  );

  const inStock    = statsMap["in_stock"]?.count ?? 0;
  const inRepair   = statsMap["in_repair"]?.count ?? 0;
  const reserved   = statsMap["reserved"]?.count ?? 0;
  const totalStock = Object.values(statsMap).reduce((s: any, v: any) => s + v.count, 0);
  const stockValue = statsMap["in_stock"]?.total_cost ?? 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Hoy es ${new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Dispositivos en stock"  value={inStock}   subtitle={`${totalStock} total en sistema`} icon={Smartphone} color="blue" />
        <StatsCard title="En reparación"           value={inRepair}  subtitle={`${reserved} reservados`}        icon={Wrench}      color="orange" />
        <StatsCard title="Ventas completadas"      value={orderStats.completed} subtitle={`${orderStats.pending} pendientes`} icon={ShoppingCart} color="green" />
        <StatsCard title="Ingresos totales"        value={`${orderStats.revenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`} icon={TrendingUp} color="green" />
      </div>

      {/* Stock value */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-3 p-6">
          <h2 className="font-semibold text-dark mb-4">Estado del inventario</h2>
          <div className="space-y-3">
            {(inventoryStats ?? []).map((s: any) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-sm text-dark-3 capitalize">{s.status.replace("_", " ")}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-dark">{s.count} uds</span>
                  <span className="text-xs text-dark-5">{Number(s.total_cost).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-3 p-6">
          <h2 className="font-semibold text-dark mb-4">Accesos rápidos</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/inventory/new", label: "Registrar dispositivo", icon: Smartphone },
              { href: "/admin/repairs/new",   label: "Nueva reparación",      icon: Wrench },
              { href: "/admin/customers/new", label: "Nuevo cliente",          icon: AlertCircle },
              { href: "/admin/orders/new",    label: "Nueva venta",            icon: ShoppingCart },
              { href: "/admin/audit",         label: "Ver auditoría",          icon: Clock },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-1 text-sm text-dark-3 transition-colors">
                <Icon className="w-4 h-4 text-dark-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

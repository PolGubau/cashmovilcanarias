import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import { getInventoryStats } from "@/lib/actions/devices";
import { getOrderStats } from "@/lib/actions/orders";
import { createClient } from "@/lib/supabase/server";
import type { DeviceMargin, InventoryStatusView } from "@/lib/supabase/types";
import { Euro, Package, Percent, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = await createClient();
  const [inventoryStats, orderStats, marginsRes] = await Promise.all([
    getInventoryStats().catch((): InventoryStatusView[] => []),
    getOrderStats().catch(() => ({ total_orders: 0, completed: 0, pending: 0, revenue: 0 })),
    supabase.from("v_device_margins").select("*").order("paid_at", { ascending: false }).limit(20),
  ]);

  const margins: DeviceMargin[] = marginsRes.data ?? [];

  const totalStockValue = (inventoryStats ?? [])
    .filter((s) => s.status === "in_stock")
    .reduce((sum, s) => sum + Number(s.total_cost), 0);

  const avgMargin = margins.length
    ? margins.reduce((s, m) => s + Number(m.margin_pct), 0) / margins.length
    : 0;

  return (
    <div>
      <PageHeader title="Estadísticas" description="Rendimiento del negocio" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Ingresos totales"
          value={orderStats.revenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          icon={Euro}
          color="green"
        />
        <StatsCard
          title="Valor stock actual"
          value={totalStockValue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Ventas completadas"
          value={orderStats.completed}
          subtitle={`${orderStats.total_orders} total`}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Margen promedio"
          value={`${avgMargin.toFixed(1)}%`}
          icon={Percent}
          color="yellow"
        />
      </div>

      {/* Últimas ventas con margen */}
      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <h2 className="font-semibold text-dark mb-4">Últimas ventas — margen por dispositivo</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3">
                {["IMEI", "Dispositivo", "Coste", "Venta", "Margen €", "Margen %", "Comprador"].map((h) => (
                  <th key={h} className="text-left pb-3 px-2 text-xs font-semibold text-dark-4 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3">
              {margins.map((m) => (
                <tr key={m.id} className="hover:bg-gray-1">
                  <td className="py-3 px-2 font-mono text-xs text-dark-4">{m.imei}</td>
                  <td className="py-3 px-2 font-medium text-dark">{m.brand} {m.model}</td>
                  <td className="py-3 px-2 text-dark-3">
                    {Number(m.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className="py-3 px-2 text-dark-3">
                    {Number(m.price_sold).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className={`py-3 px-2 font-semibold ${m.margin >= 0 ? "text-green-dark" : "text-red-dark"}`}>
                    {Number(m.margin).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className={`py-3 px-2 font-medium ${m.margin_pct >= 0 ? "text-green-dark" : "text-red-dark"}`}>
                    {Number(m.margin_pct).toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 text-dark-3">{m.buyer_name}</td>
                </tr>
              ))}
              {margins.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-dark-4">Sin ventas registradas aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

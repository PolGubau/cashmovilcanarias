import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import StatsFilters from "@/components/admin/StatsFilters";
import { getInventoryStats } from "@/lib/actions/devices";
import { getOrderStats, getSalesChartData, getTopSellers } from "@/lib/actions/orders";
import { createClient } from "@/lib/supabase/server";
import type { DeviceMargin, InventoryStatusView } from "@/lib/supabase/types";
import { Euro, Package, Percent, TrendingUp } from "lucide-react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// ── Inline bar chart (no external lib needed) ────────────────────────────────
function BarChart({ data }: { data: { date: string; revenue: number }[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-40 text-sm text-gray-400">
      Sin datos para el período seleccionado
    </div>
  );
  const max = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-1 h-40 w-full overflow-x-auto pb-1">
      {data.map((d) => {
        const pct = Math.max((d.revenue / max) * 100, 2);
        const label = d.date.slice(5); // MM-DD
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px] group">
            <div className="relative w-full flex flex-col justify-end" style={{ height: "120px" }}>
              <div
                title={`${d.revenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`}
                className="w-full rounded-t-md bg-blue/70 group-hover:bg-blue transition-colors cursor-default"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 rotate-45 origin-left whitespace-nowrap">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string; brand?: string }>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();

  type ChartPoint = { date: string; revenue: number };
  type TopSeller = { brand: string; model: string; units: number; revenue: number; margin: number };

  const [inventoryStats, orderStats, chartData, topSellers, marginsRes] = await Promise.all([
    getInventoryStats().catch((): InventoryStatusView[] => []),
    getOrderStats(filters).catch(() => ({ total_orders: 0, completed: 0, pending: 0, revenue: 0 })),
    getSalesChartData(filters).catch((): ChartPoint[] => []),
    getTopSellers({ ...filters, limit: 10 }).catch((): TopSeller[] => []),
    supabase.from("v_device_margins").select("*").order("paid_at", { ascending: false }).limit(20),
  ]);

  const margins: DeviceMargin[] = marginsRes.data ?? [];

  const totalStockValue = (inventoryStats ?? [])
    .filter((s) => s.status === "in_stock")
    .reduce((sum, s) => sum + Number(s.total_cost), 0);

  const avgMargin = margins.length
    ? margins.reduce((s, m) => s + Number(m.margin_pct), 0) / margins.length
    : 0;

  const totalChartRevenue = chartData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div>
      <PageHeader title="Estadísticas" description="Rendimiento del negocio" />

      <Suspense>
        <StatsFilters />
      </Suspense>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
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

      {/* Chart + Top Sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {/* Ventas por día */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Ventas por día</h2>
            <span className="text-xs text-gray-400">
              {totalChartRevenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} en el período
            </span>
          </div>
          <BarChart data={chartData} />
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Más vendidos</h2>
          <div className="space-y-3">
            {topSellers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">Sin datos</p>
            )}
            {topSellers.map((s, i) => (
              <div key={`${s.brand}-${s.model}`} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-300 w-4 text-right">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{s.brand} {s.model}</p>
                  <p className="text-[11px] text-gray-400">{s.units} ud · {s.margin.toLocaleString("es-ES", { style: "currency", currency: "EUR" })} margen</p>
                </div>
                <span className="text-xs font-semibold text-gray-700 shrink-0">
                  {s.revenue.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla márgenes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm">Últimas ventas — margen por dispositivo</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["IMEI", "Dispositivo", "Coste", "Venta", "Margen €", "Margen %", "Comprador"].map((h) => (
                  <th key={h} className="text-left pb-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {margins.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="py-3 px-2 font-mono text-xs text-gray-400">{m.imei}</td>
                  <td className="py-3 px-2 font-medium text-gray-800">{m.brand} {m.model}</td>
                  <td className="py-3 px-2 text-gray-500">
                    {Number(m.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className="py-3 px-2 text-gray-500">
                    {Number(m.price_sold).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className={`py-3 px-2 font-semibold ${m.margin >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Number(m.margin).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </td>
                  <td className={`py-3 px-2 font-medium ${m.margin_pct >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Number(m.margin_pct).toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 text-gray-500">{m.buyer_name}</td>
                </tr>
              ))}
              {margins.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">Sin ventas registradas aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

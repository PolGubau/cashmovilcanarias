import DataTable from "@/components/admin/DataTable";
import FilterTabs from "@/components/admin/FilterTabs";
import PageHeader from "@/components/admin/PageHeader";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/actions/orders";
import type { OrderFull } from "@/lib/supabase/types";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const orders = await getOrders({ status: sp.status, search: sp.search }).catch(() => []);
  const ORDER_TABS = [
    { value: "pending", label: "Pendiente" },
    { value: "confirmed", label: "Confirmado" },
    { value: "completed", label: "Completado" },
    { value: "cancelled", label: "Cancelado" },
    { value: "refunded", label: "Reembolsado" },
  ];

  const columns = [
    {
      key: "invoice_number",
      label: "Factura",
      render: (o: OrderFull) => (
        <Link href={`/admin/orders/${o.id}`} className="font-mono text-blue hover:underline text-xs">
          {o.invoice_number ?? "-"}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Cliente",
      render: (o: OrderFull) => (
        <div>
          <p className="font-medium text-gray-900">{o.customer_name}</p>
          <p className="text-xs text-gray-400">{o.customer_phone ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "item_count",
      label: "Dispositivos",
      render: (o: OrderFull) => `${o.item_count} ud${o.item_count !== 1 ? "s" : ""}`,
    },
    {
      key: "total",
      label: "Total",
      render: (o: OrderFull) =>
        Number(o.total).toLocaleString("es-ES", { style: "currency", currency: "EUR" }),
    },
    {
      key: "status",
      label: "Estado",
      render: (o: OrderFull) => <StatusBadge status={o.status} type="order" />,
    },
    {
      key: "payment_method",
      label: "Pago",
      render: (o: OrderFull) => o.payment_method ?? "-",
    },
    {
      key: "created_at",
      label: "Fecha",
      render: (o: OrderFull) => new Date(o.created_at).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "",
      render: (o: OrderFull) => (
        <Link href={`/admin/orders/${o.id}`} className="text-xs text-blue hover:underline">Ver →</Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ventas"
        description={`${orders?.length ?? 0} pedidos`}
        action={{ label: "Nueva venta", href: "/admin/orders/new" }}
      />

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex-1">
          <FilterTabs
            tabs={ORDER_TABS}
            activeValue={sp.status}
            baseHref="/admin/orders"
            allLabel="Todas"
          />
        </div>
        <Suspense>
          <SearchInput placeholder="Buscar cliente o factura..." />
        </Suspense>
      </div>

      <DataTable columns={columns} data={orders ?? []} emptyMessage="No hay ventas registradas" />
    </div>
  );
}

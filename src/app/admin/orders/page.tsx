import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getOrders } from "@/lib/actions/orders";
import type { OrderFull } from "@/lib/supabase/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const orders = await getOrders({ status: searchParams.status }).catch(() => []);
  const statuses = ["pending", "confirmed", "completed", "cancelled", "refunded"];

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

      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/orders"
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${!searchParams.status ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}>
          Todas
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${searchParams.status === s ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"}`}>
            {s}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={orders ?? []} emptyMessage="No hay ventas registradas" />
    </div>
  );
}

import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import DataTable from "@/components/admin/DataTable";
import { getDevices } from "@/lib/actions/devices";
import type { DeviceFull } from "@/lib/supabase/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string };
}) {
  const devices = await getDevices({
    status: searchParams.status,
    search: searchParams.search,
  }).catch(() => []);

  const columns = [
    {
      key: "imei",
      label: "IMEI",
      render: (d: DeviceFull) => (
        <Link href={`/admin/inventory/${d.id}`} className="font-mono text-blue hover:underline text-xs">
          {d.imei}
        </Link>
      ),
    },
    {
      key: "device",
      label: "Dispositivo",
      render: (d: DeviceFull) => (
        <div>
          <p className="font-medium text-dark">{d.brand} {d.model}</p>
          <p className="text-xs text-dark-4">{d.storage_gb ? `${d.storage_gb}GB` : ""} {d.color ?? ""}</p>
        </div>
      ),
    },
    { key: "condition", label: "Estado físico", render: (d: DeviceFull) => d.condition },
    {
      key: "status",
      label: "Estado",
      render: (d: DeviceFull) => <StatusBadge status={d.status} type="device" />,
    },
    {
      key: "cost_price",
      label: "Coste",
      render: (d: DeviceFull) =>
        Number(d.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" }),
    },
    {
      key: "supplier_name",
      label: "Proveedor",
      render: (d: DeviceFull) => d.supplier_name ?? "—",
    },
    {
      key: "purchase_date",
      label: "Compra",
      render: (d: DeviceFull) =>
        new Date(d.purchase_date).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "",
      render: (d: DeviceFull) => (
        <Link href={`/admin/inventory/${d.id}`}
          className="text-xs text-blue hover:underline">
          Ver →
        </Link>
      ),
    },
  ];

  const statuses = ["in_stock", "reserved", "sold", "in_repair", "returned", "written_off"];

  return (
    <div>
      <PageHeader
        title="Inventario de dispositivos"
        description={`${devices?.length ?? 0} dispositivos`}
        action={{ label: "Registrar dispositivo", href: "/admin/inventory/new" }}
      />

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/inventory"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!searchParams.status ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
          Todos
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/inventory?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${searchParams.status === s ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={devices ?? []}
        emptyMessage="No hay dispositivos con estos filtros"
      />
    </div>
  );
}

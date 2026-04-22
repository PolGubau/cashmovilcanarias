import DataTable from "@/components/admin/DataTable";
import FilterTabs from "@/components/admin/FilterTabs";
import PageHeader from "@/components/admin/PageHeader";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDevices } from "@/lib/actions/devices";
import type { DeviceFull } from "@/lib/supabase/types";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const devices = await getDevices({
    status: sp.status,
    search: sp.search,
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
          <p className="font-medium text-gray-900">{d.brand} {d.model}</p>
          <p className="text-xs text-gray-400">{d.storage_gb ? `${d.storage_gb}GB` : ""} {d.color ?? ""}</p>
        </div>
      ),
    },
    {
      key: "product",
      label: "Producto catálogo",
      render: (d: DeviceFull) =>
        d.product_name ? (
          <Link href={`/admin/products/${d.product_id}`} className="text-xs text-blue hover:underline">
            {d.product_name}
          </Link>
        ) : (
          <span className="text-xs text-gray-400 italic">Sin vincular</span>
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
      render: (d: DeviceFull) => d.supplier_name ?? "-",
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

  const DEVICE_TABS = [
    { value: "in_stock", label: "En stock" },
    { value: "reserved", label: "Reservado" },
    { value: "in_repair", label: "En reparación" },
    { value: "sold", label: "Vendido" },
    { value: "returned", label: "Devuelto" },
    { value: "written_off", label: "Dado de baja" },
  ];

  return (
    <div>
      <PageHeader
        title="Inventario de dispositivos"
        description={`${devices?.length ?? 0} dispositivos`}
        action={{ label: "Registrar dispositivo", href: "/admin/inventory/new" }}
      />

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex-1">
          <FilterTabs
            tabs={DEVICE_TABS}
            activeValue={sp.status}
            baseHref="/admin/inventory"
            allLabel="Todos"
          />
        </div>
        <Suspense>
          <SearchInput placeholder="Buscar IMEI, marca o modelo..." />
        </Suspense>
      </div>

      <DataTable
        columns={columns}
        data={devices ?? []}
        emptyMessage="No hay dispositivos con estos filtros"
      />
    </div>
  );
}

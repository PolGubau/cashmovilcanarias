import DataTable from "@/components/admin/DataTable";
import { ExportButton } from "@/components/admin/ExportButton";
import FilterTabs from "@/components/admin/FilterTabs";
import PageHeader from "@/components/admin/PageHeader";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDevices, getSoldDevicesReport, getYearlyPurchasesReport } from "@/lib/actions/devices";
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

  // ── Export column definitions ───────────────────────────────────────────────
  const fmt = {
    eur: (v: unknown) => `${Number(v).toFixed(2)} €`,
    date: (v: unknown) => (v ? new Date(v as string).toLocaleDateString("es-ES") : ""),
  };

  const DEVICE_EXPORT_COLS = [
    { key: "imei", label: "IMEI" },
    { key: "brand", label: "Marca" },
    { key: "model", label: "Modelo" },
    { key: "storage_gb", label: "Almacenamiento (GB)" },
    { key: "color", label: "Color" },
    { key: "condition", label: "Estado físico" },
    { key: "status", label: "Estado" },
    { key: "cost_price", label: "Precio compra (€)", format: fmt.eur },
    { key: "purchase_date", label: "Fecha compra", format: fmt.date },
    { key: "supplier_name", label: "Proveedor" },
    { key: "purchase_invoice", label: "Factura compra" },
  ];

  const POLICE_REPORT_COLS = [
    { key: "imei", label: "IMEI" },
    { key: "imei2", label: "IMEI2" },
    { key: "brand", label: "Marca" },
    { key: "model", label: "Modelo" },
    { key: "storage_gb", label: "Almacenamiento (GB)" },
    { key: "color", label: "Color" },
    { key: "condition", label: "Estado físico" },
    { key: "cost_price", label: "Precio compra (€)", format: fmt.eur },
    { key: "purchase_date", label: "Fecha compra", format: fmt.date },
    { key: "purchase_invoice", label: "Factura compra" },
    { key: "supplier_name", label: "Proveedor — Nombre" },
    { key: "supplier_dni", label: "Proveedor — DNI" },
    { key: "supplier_phone", label: "Proveedor — Teléfono" },
    { key: "sold_at", label: "Fecha venta", format: fmt.date },
    { key: "sale_price", label: "Precio venta (€)", format: fmt.eur },
    { key: "buyer_name", label: "Comprador — Nombre" },
    { key: "buyer_phone", label: "Comprador — Teléfono" },
  ];

  const YEARLY_PURCHASE_COLS = [
    { key: "imei", label: "IMEI" },
    { key: "brand", label: "Marca" },
    { key: "model", label: "Modelo" },
    { key: "storage_gb", label: "Almacenamiento (GB)" },
    { key: "color", label: "Color" },
    { key: "condition", label: "Estado físico" },
    { key: "status", label: "Estado actual" },
    { key: "cost_price", label: "Precio compra (€)", format: fmt.eur },
    { key: "purchase_date", label: "Fecha compra", format: fmt.date },
    { key: "supplier_name", label: "Proveedor — Nombre" },
    { key: "supplier_dni", label: "Proveedor — DNI" },
    { key: "supplier_phone", label: "Proveedor — Teléfono" },
    { key: "purchase_invoice", label: "Factura compra" },
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

      <div className="flex items-center gap-3 mb-4 flex-wrap">
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

      {/* Export row */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-xs text-gray-400 mr-1">Exportar:</span>
        <ExportButton
          label="Vista actual"
          filename={`inventario-${sp.status ?? "todos"}-${new Date().toISOString().slice(0, 10)}`}
          title={`Inventario — ${sp.status ?? "todos"}`}
          data={devices as unknown as Record<string, unknown>[]}
          columns={DEVICE_EXPORT_COLS}
        />
        <ExportButton
          label="Informe policial"
          filename={`informe-policial-${new Date().toISOString().slice(0, 10)}`}
          title="Informe Policial — Móviles Vendidos"
          fetchData={getSoldDevicesReport}
          columns={POLICE_REPORT_COLS}
        />
        <ExportButton
          label={`Compras ${new Date().getFullYear()}`}
          filename={`compras-${new Date().getFullYear()}`}
          title={`Compras del año ${new Date().getFullYear()}`}
          fetchData={getYearlyPurchasesReport}
          columns={YEARLY_PURCHASE_COLS}
        />
      </div>

      <DataTable
        columns={columns}
        data={devices ?? []}
        emptyMessage="No hay dispositivos con estos filtros"
      />
    </div>
  );
}

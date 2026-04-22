import DataTable from "@/components/admin/DataTable";
import FilterTabs from "@/components/admin/FilterTabs";
import PageHeader from "@/components/admin/PageHeader";
import SearchInput from "@/components/admin/SearchInput";
import StatusBadge from "@/components/admin/StatusBadge";
import { getRepairs } from "@/lib/actions/repairs";
import type { RepairFull } from "@/lib/supabase/types";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const repairs = await getRepairs({ status: sp.status }).catch(() => []);

  const REPAIR_TABS = [
    { value: "received", label: "Recibido" },
    { value: "diagnosing", label: "Diagnosticando" },
    { value: "waiting_parts", label: "Esperando piezas" },
    { value: "in_progress", label: "En proceso" },
    { value: "ready", label: "Listo para recoger" },
    { value: "delivered", label: "Entregado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const columns = [
    {
      key: "customer",
      label: "Cliente",
      render: (r: RepairFull) => (
        <div>
          <p className="font-medium text-dark">{r.customer_name}</p>
          <p className="text-xs text-dark-4">{r.customer_phone ?? "-"}</p>
        </div>
      ),
    },
    {
      key: "device",
      label: "Dispositivo",
      render: (r: RepairFull) => (
        <div>
          <p className="text-dark-3">{r.resolved_brand} {r.resolved_model}</p>
          {r.resolved_imei && <p className="text-xs font-mono text-dark-4">{r.resolved_imei}</p>}
        </div>
      ),
    },
    {
      key: "description",
      label: "Problema",
      render: (r: RepairFull) => (
        <p className="max-w-xs truncate text-dark-3">{r.description}</p>
      ),
    },
    {
      key: "status",
      label: "Estado",
      render: (r: RepairFull) => <StatusBadge status={r.status} type="repair" />,
    },
    {
      key: "budget",
      label: "Presupuesto",
      render: (r: RepairFull) =>
        r.budget
          ? Number(r.budget).toLocaleString("es-ES", { style: "currency", currency: "EUR" })
          : "-",
    },
    {
      key: "received_at",
      label: "Recibido",
      render: (r: RepairFull) =>
        new Date(r.received_at).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "",
      render: (r: RepairFull) => (
        <Link href={`/admin/repairs/${r.id}`} className="text-xs text-blue hover:underline">
          Ver →
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reparaciones"
        description={`${repairs?.length ?? 0} órdenes`}
        action={{ label: "Nueva reparación", href: "/admin/repairs/new" }}
      />

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex-1">
          <FilterTabs
            tabs={REPAIR_TABS}
            activeValue={sp.status}
            baseHref="/admin/repairs"
            allLabel="Todas"
          />
        </div>
        <Suspense>
          <SearchInput placeholder="Buscar cliente o IMEI..." />
        </Suspense>
      </div>

      <DataTable columns={columns} data={repairs ?? []} emptyMessage="No hay reparaciones" />
    </div>
  );
}

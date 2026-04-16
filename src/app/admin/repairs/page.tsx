import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import DataTable from "@/components/admin/DataTable";
import { getRepairs } from "@/lib/actions/repairs";
import type { RepairFull } from "@/lib/supabase/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RepairsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const repairs = await getRepairs({ status: searchParams.status }).catch(() => []);

  const statuses = ["received", "diagnosing", "waiting_parts", "in_progress", "ready", "delivered", "cancelled"];

  const columns = [
    {
      key: "customer",
      label: "Cliente",
      render: (r: RepairFull) => (
        <div>
          <p className="font-medium text-dark">{r.customer_name}</p>
          <p className="text-xs text-dark-4">{r.customer_phone ?? "—"}</p>
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
          : "—",
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

      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/repairs"
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${!searchParams.status ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
          Todas
        </Link>
        {statuses.map((s) => (
          <Link key={s} href={`/admin/repairs?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${searchParams.status === s ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
            {s.replace(/_/g, " ")}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={repairs ?? []} emptyMessage="No hay reparaciones" />
    </div>
  );
}

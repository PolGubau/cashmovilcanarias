import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getRepairById } from "@/lib/actions/repairs";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RepairActions from "./RepairActions";

export const dynamic = "force-dynamic";

export default async function RepairDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repair = await getRepairById(id).catch(() => null);

  if (!repair) notFound();

  return (
    <div className="space-y-6 max-w-5xl">
      <Link
        href="/admin/repairs"
        className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-dark transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a reparaciones
      </Link>

      <PageHeader
        title={`${repair.resolved_brand ?? repair.device_brand ?? "Dispositivo"} ${repair.resolved_model ?? repair.device_model ?? ""}`}
        description={`Reparación #${repair.id.slice(-8).toUpperCase()}`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="xl:col-span-2 space-y-6">
          <Section title="Cliente">
            <Grid>
              <Info label="Nombre" value={repair.customer_name} />
              <Info label="Teléfono" value={repair.customer_phone ?? "-"} />
            </Grid>
          </Section>

          <Section title="Dispositivo">
            <Grid>
              <Info label="Marca" value={repair.resolved_brand ?? repair.device_brand ?? "-"} />
              <Info label="Modelo" value={repair.resolved_model ?? repair.device_model ?? "-"} />
              <Info label="IMEI" value={repair.resolved_imei ?? repair.device_imei ?? "-"} mono />
            </Grid>
          </Section>

          <Section title="Avería">
            <div className="space-y-3">
              <div>
                <p className="text-xs text-dark-4 font-medium mb-1">Descripción</p>
                <p className="text-sm text-dark">{repair.description}</p>
              </div>
              {repair.diagnosis && (
                <div>
                  <p className="text-xs text-dark-4 font-medium mb-1">Diagnóstico</p>
                  <p className="text-sm text-dark">{repair.diagnosis}</p>
                </div>
              )}
              {repair.solution && (
                <div>
                  <p className="text-xs text-dark-4 font-medium mb-1">Solución</p>
                  <p className="text-sm text-dark">{repair.solution}</p>
                </div>
              )}
              {repair.parts_used && repair.parts_used.length > 0 && (
                <div>
                  <p className="text-xs text-dark-4 font-medium mb-1">Piezas usadas</p>
                  <ul className="list-disc list-inside text-sm text-dark space-y-0.5">
                    {repair.parts_used.map((p: string, i: number) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Section>

          <Section title="Económico">
            <Grid>
              <Info label="Presupuesto" value={repair.budget != null ? formatCurrency(repair.budget) : "-"} />
              <Info label="Coste final" value={repair.cost != null ? formatCurrency(repair.cost) : "-"} />
              <Info label="Depósito pagado" value={formatCurrency(repair.deposit_paid)} />
              <Info label="Garantía" value={`${repair.warranty_days} días`} />
            </Grid>
          </Section>

          {repair.notes && (
            <Section title="Notas internas">
              <p className="text-sm text-dark-3">{repair.notes}</p>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Section title="Estado actual">
            <StatusBadge status={repair.status} type="repair" />
          </Section>

          <Section title="Fechas">
            <div className="space-y-2">
              <DateRow label="Recibido" value={formatDateTime(repair.received_at)} />
              <DateRow label="Diagnosticado" value={formatDate(repair.diagnosed_at)} />
              <DateRow label="Estimado listo" value={formatDate(repair.estimated_ready_at)} />
              <DateRow label="Completado" value={formatDate(repair.completed_at)} />
              <DateRow label="Entregado" value={formatDate(repair.delivered_at)} />
              {repair.warranty_expires_at && (
                <DateRow label="Garantía hasta" value={formatDate(repair.warranty_expires_at)} />
              )}
            </div>
          </Section>

          <RepairActions repairId={repair.id} currentStatus={repair.status} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-3 p-6">
      <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4 text-sm uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>;
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-dark-4 font-medium">{label}</p>
      <p className={`text-sm text-dark mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-xs text-dark-4">{label}</p>
      <p className="text-xs font-medium text-dark">{value}</p>
    </div>
  );
}

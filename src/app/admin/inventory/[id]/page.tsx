import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { getDeviceAuditTrail } from "@/lib/actions/audit";
import { getDeviceById } from "@/lib/actions/devices";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const [device, trail] = await Promise.all([
    getDeviceById(params.id).catch(() => null),
    getDeviceAuditTrail(params.id).catch(() => []),
  ]);

  if (!device) notFound();

  return (
    <div>
      <PageHeader
        title={`${device.brand} ${device.model}`}
        description={`IMEI: ${device.imei}`}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="xl:col-span-2 space-y-6">
          <Section title="Dispositivo">
            <Grid>
              <Info label="IMEI" value={device.imei} mono />
              {device.imei2 && <Info label="IMEI 2" value={device.imei2} mono />}
              <Info label="Marca" value={device.brand} />
              <Info label="Modelo" value={device.model} />
              <Info label="Almacenamiento" value={device.storage_gb ? `${device.storage_gb} GB` : "-"} />
              <Info label="Color" value={device.color ?? "-"} />
              <Info label="Condición" value={device.condition} />
              <Info label="Estado SIM" value={device.unlock_status ?? "-"} />
              {device.battery_health && <Info label="Batería" value={`${device.battery_health}%`} />}
            </Grid>
          </Section>

          <Section title="Compra">
            <Grid>
              <Info label="Precio coste" value={`${Number(device.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`} />
              <Info label="Fecha compra" value={new Date(device.purchase_date).toLocaleDateString("es-ES")} />
              <Info label="Proveedor" value={device.supplier_name ?? "-"} />
              <Info label="DNI proveedor" value={device.supplier_dni ?? "-"} />
              <Info label="Factura compra" value={device.purchase_invoice ?? "-"} />
            </Grid>
          </Section>

          {device.status === "sold" && (
            <Section title="Venta">
              <Grid>
                <Info label="Precio venta" value={`${Number(device.sale_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`} />
                <Info label="Margen" value={`${Number(device.sale_price! - device.cost_price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}`} />
                <Info label="Comprador" value={device.buyer_name ?? "-"} />
                <Info label="Fecha venta" value={device.sold_at ? new Date(device.sold_at).toLocaleDateString("es-ES") : "-"} />
              </Grid>
            </Section>
          )}

          {device.notes && (
            <Section title="Notas">
              <p className="text-sm text-dark-3">{device.notes}</p>
            </Section>
          )}
        </div>

        {/* Sidebar: status + audit trail */}
        <div className="space-y-6">
          <Section title="Estado actual">
            <StatusBadge status={device.status} type="device" />
          </Section>

          <Section title="Historial de movimientos">
            {trail?.length === 0 ? (
              <p className="text-sm text-dark-4">Sin movimientos registrados</p>
            ) : (
              <ol className="relative border-l border-gray-3 space-y-4 ml-2">
                {trail?.map((m: any) => (
                  <li key={m.id} className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-blue-light-3 border-2 border-blue" />
                    <p className="text-xs font-medium text-dark">{m.to_status.replace("_", " ")}</p>
                    <p className="text-xs text-dark-4">{m.reason.replace("_", " ")}</p>
                    <p className="text-xs text-dark-5">{new Date(m.created_at).toLocaleString("es-ES")}</p>
                    {m.profiles?.full_name && <p className="text-xs text-dark-5">por {m.profiles.full_name}</p>}
                  </li>
                ))}
              </ol>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-3 p-6">
      <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4 text-sm uppercase tracking-wide">{title}</h2>
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

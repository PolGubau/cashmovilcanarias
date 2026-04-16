import PageHeader from "@/components/admin/PageHeader";
import { getStockMovements } from "@/lib/actions/audit";
import Link from "next/link";

export const dynamic = "force-dynamic";

const REASON_LABELS: Record<string, string> = {
  purchase:               "Compra",
  sale:                   "Venta",
  repair_in:              "Entrada a reparación",
  repair_out:             "Salida de reparación",
  return:                 "Devolución",
  write_off:              "Baja",
  correction:             "Corrección manual",
  reservation:            "Reserva",
  reservation_cancelled:  "Reserva cancelada",
};

const REASON_COLORS: Record<string, string> = {
  purchase:    "bg-blue-light-5 text-blue-dark",
  sale:        "bg-green-light-5 text-green-dark",
  repair_in:   "bg-orange/10 text-orange-dark",
  repair_out:  "bg-teal/10 text-teal-dark",
  return:      "bg-yellow-light-2 text-yellow-dark-2",
  write_off:   "bg-red-light-5 text-red-dark",
  correction:  "bg-gray-2 text-gray-7",
  reservation: "bg-blue-light-4 text-blue",
  reservation_cancelled: "bg-red-light-6 text-red",
};

export default async function AuditPage() {
  const movements = await getStockMovements({ limit: 200 }).catch(() => []);

  return (
    <div>
      <PageHeader
        title="Auditoría de movimientos"
        description="Log append-only de todos los cambios de estado de dispositivos"
      />

      <div className="bg-white rounded-xl border border-gray-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3 bg-gray-1">
                {["Fecha", "Dispositivo", "IMEI", "De", "A", "Motivo", "Actor"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dark-4 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3">
              {movements?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-dark-4">
                    Sin movimientos registrados
                  </td>
                </tr>
              ) : (
                movements?.map((m: any) => (
                  <tr key={m.id} className="hover:bg-gray-1">
                    <td className="px-4 py-3 text-xs text-dark-5 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleString("es-ES")}
                    </td>
                    <td className="px-4 py-3 text-dark-3">
                      {m.devices ? (
                        <Link href={`/admin/inventory/${m.device_id}`} className="hover:text-blue">
                          {m.devices.brand} {m.devices.model}
                        </Link>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-dark-4">
                      {m.devices?.imei ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-4">
                      {m.from_status?.replace("_", " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-dark">
                      {m.to_status.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${REASON_COLORS[m.reason] ?? "bg-gray-2 text-gray-7"}`}>
                        {REASON_LABELS[m.reason] ?? m.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-dark-4">
                      {m.profiles?.full_name ?? "sistema"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

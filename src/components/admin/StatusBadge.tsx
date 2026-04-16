import type { DeviceStatus, RepairStatus, OrderStatus } from "@/lib/supabase/types";

const DEVICE: Record<DeviceStatus, [string, string]> = {
  purchased:   ["bg-yellow-light-2 text-yellow-dark-2", "Comprado"],
  in_stock:    ["bg-green-light-5 text-green-dark",     "En stock"],
  reserved:    ["bg-blue-light-5 text-blue-dark",       "Reservado"],
  sold:        ["bg-gray-2 text-gray-7",                "Vendido"],
  in_repair:   ["bg-orange/10 text-orange-dark",        "En reparación"],
  returned:    ["bg-red-light-5 text-red-dark",         "Devuelto"],
  written_off: ["bg-red-light-6 text-red",              "Dado de baja"],
};

const REPAIR: Record<RepairStatus, [string, string]> = {
  received:      ["bg-blue-light-5 text-blue-dark",    "Recibido"],
  diagnosing:    ["bg-yellow-light-2 text-yellow-dark-2", "Diagnosticando"],
  waiting_parts: ["bg-orange/10 text-orange-dark",     "Esperando piezas"],
  in_progress:   ["bg-blue-light-4 text-blue",         "En proceso"],
  ready:         ["bg-green-light-5 text-green-dark",  "Listo"],
  delivered:     ["bg-gray-2 text-gray-7",             "Entregado"],
  cancelled:     ["bg-red-light-5 text-red-dark",      "Cancelado"],
};

const ORDER: Record<OrderStatus, [string, string]> = {
  pending:   ["bg-yellow-light-2 text-yellow-dark-2", "Pendiente"],
  confirmed: ["bg-blue-light-5 text-blue-dark",       "Confirmado"],
  completed: ["bg-green-light-5 text-green-dark",     "Completado"],
  cancelled: ["bg-red-light-5 text-red-dark",         "Cancelado"],
  refunded:  ["bg-gray-2 text-gray-7",                "Reembolsado"],
};

interface Props {
  status: string;
  type: "device" | "repair" | "order";
}

export default function StatusBadge({ status, type }: Props) {
  const map = type === "device" ? DEVICE : type === "repair" ? REPAIR : ORDER;
  const [style, label] = (map as any)[status] ?? ["bg-gray-2 text-gray-7", status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

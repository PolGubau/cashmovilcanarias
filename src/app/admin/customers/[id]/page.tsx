import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCustomerById, getCustomerHistory, getCustomerRepairs } from "@/lib/actions/customers";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { getWarrantyStatus } from "@/lib/warranty";
import { ArrowLeft, CheckCircle, Clock, CreditCard, Mail, Phone, ShoppingBag, User, Wrench, XCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const REPAIR_STATUS_LABEL: Record<string, string> = {
  received: "Recibido", diagnosing: "Diagnosticando", waiting_parts: "Esperando piezas",
  in_progress: "En reparación", ready: "Listo", delivered: "Entregado", cancelled: "Cancelado",
};
const REPAIR_BADGE: Record<string, "default" | "primary" | "warning" | "success" | "danger"> = {
  received: "default", diagnosing: "primary", waiting_parts: "warning",
  in_progress: "primary", ready: "success", delivered: "success", cancelled: "danger",
};

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [customer, history, repairs] = await Promise.all([
    getCustomerById(id).catch(() => null),
    getCustomerHistory(id),
    getCustomerRepairs(id),
  ]);

  if (!customer) notFound();

  const totalSpent = history.reduce((s, h) => s + Number(h.price_sold), 0);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <Link href="/admin/customers" className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-dark transition-colors">
        <ArrowLeft className="h-4 w-4" /> Volver a clientes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-3 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-light-5 flex items-center justify-center shrink-0">
              <User className="h-7 w-7 text-blue" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-dark">{customer.full_name}</h1>
              <div className="flex items-center gap-4 mt-1.5 text-sm text-dark-4">
                {customer.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>}
                {customer.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{customer.email}</span>}
                {customer.dni && <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" />{customer.dni}</span>}
              </div>
            </div>
          </div>
          <Badge variant={customer.is_supplier ? "warning" : "primary"}>
            {customer.is_supplier ? "Proveedor" : "Cliente"}
          </Badge>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Total compras" value={formatCurrency(totalSpent)} />
          <Stat label="Dispositivos" value={`${history.length}`} />
          <Stat label="Tickets" value={`${repairs.length}`} />
        </div>
      </div>

      {/* Purchase history + warranty */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> Historial de compras</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-dark-4">Sin compras registradas</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-3 bg-gray-1">
                <th className="text-left py-3 px-4 font-medium text-dark-3">Dispositivo</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">IMEI</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Precio</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Garantía</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-3">
                {history.map((h) => {
                  const w = getWarrantyStatus(h.warranty_expires_at);
                  return (
                    <tr key={h.device_id} className="hover:bg-gray-1">
                      <td className="py-3 px-4 font-medium text-dark">{h.brand} {h.model}</td>
                      <td className="py-3 px-4 font-mono text-xs text-dark-4">{h.imei}</td>
                      <td className="py-3 px-4 text-dark-3">{formatDate(h.order_date)}</td>
                      <td className="py-3 px-4 text-dark-3">{formatCurrency(h.price_sold)}</td>
                      <td className="py-3 px-4">
                        {w.active
                          ? <span className="inline-flex items-center gap-1 text-green text-xs font-medium"><CheckCircle className="h-3.5 w-3.5" />{w.label}</span>
                          : h.warranty_expires_at
                            ? <span className="inline-flex items-center gap-1 text-red text-xs font-medium"><XCircle className="h-3.5 w-3.5" />{w.label}</span>
                            : <span className="text-dark-4 text-xs"> - </span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Repairs / tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wrench className="h-4 w-4" /> Tickets de servicio técnico</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {repairs.length === 0 ? (
            <p className="py-8 text-center text-sm text-dark-4">Sin tickets registrados</p>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-3 bg-gray-1">
                <th className="text-left py-3 px-4 font-medium text-dark-3">Dispositivo</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Problema</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Entrada</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Coste</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-3">
                {(repairs as any[]).map((r) => (
                  <tr key={r.id} className="hover:bg-gray-1">
                    <td className="py-3 px-4 text-dark">{r.device_brand ?? "—"} {r.device_model ?? ""}</td>
                    <td className="py-3 px-4 text-dark-3 max-w-xs truncate">{r.description}</td>
                    <td className="py-3 px-4 text-dark-3">{formatDate(r.received_at)}</td>
                    <td className="py-3 px-4"><Badge variant={REPAIR_BADGE[r.status] ?? "default"}>{REPAIR_STATUS_LABEL[r.status] ?? r.status}</Badge></td>
                    <td className="py-3 px-4 text-dark-3">{r.cost ? formatCurrency(r.cost) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-xl font-semibold text-dark">{value}</p>
      <p className="text-xs text-dark-4 mt-0.5">{label}</p>
    </div>
  );
}

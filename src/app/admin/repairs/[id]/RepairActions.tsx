"use client";

import { toast } from "@/components/ui/toast";
import { updateRepair } from "@/lib/actions/repairs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = [
  { value: "received", label: "Recibido" },
  { value: "diagnosing", label: "Diagnosticando" },
  { value: "waiting_parts", label: "Esperando piezas" },
  { value: "in_progress", label: "En reparación" },
  { value: "ready", label: "Listo" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

interface RepairActionsProps {
  repairId: string;
  currentStatus: string;
}

export default function RepairActions({ repairId, currentStatus }: RepairActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (newStatus === status) return;
    setSaving(true);
    try {
      await updateRepair(repairId, { status: newStatus as any });
      setStatus(newStatus);
      toast.success("Estado actualizado");
      router.refresh();
    } catch {
      toast.error("Error al actualizar el estado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-3 p-6">
      <h2 className="font-semibold text-dark border-b border-gray-3 pb-3 mb-4 text-sm uppercase tracking-wide">
        Cambiar estado
      </h2>
      <div className="space-y-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            disabled={saving}
            onClick={() => handleStatusChange(s.value)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
              status === s.value
                ? "bg-dark text-white border-dark font-medium"
                : "text-dark-3 border-gray-3 hover:border-dark hover:text-dark"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

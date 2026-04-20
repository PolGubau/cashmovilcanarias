"use client";

import { updateUserRole } from "@/lib/actions/users";
import type { UserRole } from "@/lib/supabase/types";
import { useState, useTransition } from "react";

const ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: "admin",    label: "Admin",    description: "Panel completo + gestión de usuarios" },
  { value: "staff",    label: "Staff",    description: "Panel completo sin gestión de usuarios" },
  { value: "customer", label: "Cliente",  description: "Sin acceso al panel admin" },
];

const roleColors: Record<UserRole, string> = {
  admin:    "bg-blue/10 text-blue border-blue/20",
  staff:    "bg-green/10 text-green-dark border-green/20",
  customer: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function UserRoleSelect({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string;
  currentRole: UserRole;
  isSelf: boolean;
}) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(next: UserRole) {
    setRole(next);
    setSaved(false);
    startTransition(async () => {
      await updateUserRole(userId, next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  if (isSelf) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${roleColors[role]}`}>
        {ROLES.find((r) => r.value === role)?.label} (tú)
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={role}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as UserRole)}
        className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue/40 disabled:opacity-50 cursor-pointer"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label} — {r.description}
          </option>
        ))}
      </select>
      {isPending && <span className="text-xs text-gray-400">Guardando…</span>}
      {saved && !isPending && <span className="text-xs text-green-dark">✓ Guardado</span>}
    </div>
  );
}

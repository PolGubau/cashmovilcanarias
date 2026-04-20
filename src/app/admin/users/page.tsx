import PageHeader from "@/components/admin/PageHeader";
import UserRoleSelect from "@/components/admin/UserRoleSelect";
import { getProfilesWithEmail } from "@/lib/actions/users";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  staff: "Staff",
  customer: "Cliente",
};

const roleDot: Record<string, string> = {
  admin: "bg-blue",
  staff: "bg-green-dark",
  customer: "bg-gray-300",
};

export default async function UsersPage() {
  const [users, supabase] = await Promise.all([
    getProfilesWithEmail().catch(() => []),
    createClient(),
  ]);

  const { data: { user: me } } = await supabase.auth.getUser();

  return (
    <div>
      <PageHeader
        title="Gestión de usuarios"
        description="Controla qué usuarios tienen acceso al panel de administración"
      />

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        {/* Legend */}
        <div className="px-6 py-3 bg-gray-50/70 border-b border-gray-100 flex flex-wrap gap-4">
          {[
            { role: "admin",    desc: "Panel completo + gestión de usuarios" },
            { role: "staff",    desc: "Panel completo sin gestión de usuarios" },
            { role: "customer", desc: "Sin acceso al panel" },
          ].map(({ role, desc }) => (
            <div key={role} className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${roleDot[role]}`} />
              <strong className="text-gray-700">{roleLabel[role]}</strong>
              <span>— {desc}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-150">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Usuario</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Email</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Alta</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center text-[13px] text-gray-400">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                return (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-semibold text-gray-500 shrink-0">
                          {(u.full_name ?? u.email)[0].toUpperCase()}
                        </div>
                        <span className="text-[13px] font-medium text-gray-800">
                          {u.full_name ?? <span className="text-gray-400 italic">Sin nombre</span>}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] bg-blue/10 text-blue px-1.5 py-0.5 rounded font-medium">tú</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-400">
                      {new Date(u.created_at).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-5 py-3.5">
                      <UserRoleSelect userId={u.id} currentRole={u.role} isSelf={isSelf} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-[12px] text-gray-400">
        <ShieldCheck className="size-4 shrink-0 mt-0.5 text-gray-300" />
        <p>Los cambios de rol tienen efecto inmediato. El usuario afectado notará el cambio en su próxima petición.</p>
      </div>
    </div>
  );
}

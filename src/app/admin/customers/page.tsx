import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
import { getCustomers } from "@/lib/actions/customers";
import type { Customer } from "@/lib/supabase/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const isSupplier = searchParams.type === "supplier" ? true : searchParams.type === "buyer" ? false : undefined;
  const customers = await getCustomers({ is_supplier: isSupplier }).catch(() => []);

  const columns = [
    {
      key: "full_name",
      label: "Nombre",
      render: (c: Customer) => (
        <Link href={`/admin/customers/${c.id}`} className="font-medium text-dark hover:text-blue">
          {c.full_name}
        </Link>
      ),
    },
    { key: "phone", label: "Teléfono", render: (c: Customer) => c.phone ?? "-" },
    { key: "email", label: "Email", render: (c: Customer) => c.email ?? "-" },
    { key: "dni", label: "DNI/NIE", render: (c: Customer) => c.dni ?? "-" },
    {
      key: "is_supplier",
      label: "Tipo",
      render: (c: Customer) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.is_supplier ? "bg-yellow-light-2 text-yellow-dark-2" : "bg-blue-light-5 text-blue-dark"}`}>
          {c.is_supplier ? "Proveedor" : "Cliente"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Alta",
      render: (c: Customer) => new Date(c.created_at).toLocaleDateString("es-ES"),
    },
    {
      key: "actions",
      label: "",
      render: (c: Customer) => (
        <Link href={`/admin/customers/${c.id}`} className="text-xs text-blue hover:underline">Ver →</Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Clientes y proveedores"
        description={`${customers?.length ?? 0} registros`}
        action={{ label: "Nuevo cliente", href: "/admin/customers/new" }}
      />

      <div className="flex gap-2 mb-6">
        {[
          { href: "/admin/customers", label: "Todos", active: !searchParams.type },
          { href: "/admin/customers?type=buyer", label: "Clientes", active: searchParams.type === "buyer" },
          { href: "/admin/customers?type=supplier", label: "Proveedores", active: searchParams.type === "supplier" },
        ].map(({ href, label, active }) => (
          <Link key={href} href={href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${active ? "bg-dark text-white border-dark" : "bg-white text-dark-4 border-gray-3 hover:border-dark"}`}>
            {label}
          </Link>
        ))}
      </div>

      <DataTable columns={columns} data={customers ?? []} emptyMessage="No hay clientes registrados" />
    </div>
  );
}

import PageHeader from "@/components/admin/PageHeader";
import CustomerForm from "@/components/admin/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div>
      <PageHeader title="Nuevo cliente / proveedor" description="Registra un contacto en el CRM" />
      <CustomerForm />
    </div>
  );
}

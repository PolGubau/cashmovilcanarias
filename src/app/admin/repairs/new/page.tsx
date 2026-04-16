import PageHeader from "@/components/admin/PageHeader";
import RepairForm from "@/components/admin/RepairForm";

export default function NewRepairPage() {
  return (
    <div>
      <PageHeader title="Nueva reparación" description="Registra una orden de reparación" />
      <RepairForm />
    </div>
  );
}

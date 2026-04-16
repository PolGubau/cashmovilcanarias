import PageHeader from "@/components/admin/PageHeader";
import OrderForm from "@/components/admin/OrderForm";

export default function NewOrderPage() {
  return (
    <div>
      <PageHeader title="Nueva venta" description="Registra una venta de dispositivos" />
      <OrderForm />
    </div>
  );
}

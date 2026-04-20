import OrderForm from "@/components/admin/OrderForm";
import PageHeader from "@/components/admin/PageHeader";
import { getCustomers } from "@/lib/actions/customers";
import { getDevices } from "@/lib/actions/devices";
import type { Customer, DeviceFull } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const [customers, devices] = await Promise.all([
    getCustomers({ is_supplier: false }).catch((): Customer[] => []),
    getDevices({ status: "in_stock" }).catch((): DeviceFull[] => []),
  ]);

  return (
    <div>
      <PageHeader title="Nueva venta" description="Registra una venta de dispositivos" />
      <OrderForm customers={customers} devices={devices} />
    </div>
  );
}

import PageHeader from "@/components/admin/PageHeader";
import RepairForm from "@/components/admin/RepairForm";
import { getCustomers } from "@/lib/actions/customers";
import { getDevices } from "@/lib/actions/devices";
import type { Customer, DeviceFull } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function NewRepairPage() {
  const [customers, inventoryDevices] = await Promise.all([
    getCustomers({ is_supplier: false }).catch((): Customer[] => []),
    getDevices({ status: "in_stock" }).catch((): DeviceFull[] => []),
  ]);

  return (
    <div>
      <PageHeader title="Nueva reparación" description="Registra una orden de reparación" />
      <RepairForm customers={customers} inventoryDevices={inventoryDevices} />
    </div>
  );
}

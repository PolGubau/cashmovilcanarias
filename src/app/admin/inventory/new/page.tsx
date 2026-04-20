import DeviceForm from "@/components/admin/DeviceForm";
import PageHeader from "@/components/admin/PageHeader";
import { getCustomers } from "@/lib/actions/customers";
import { getProductsForSelect } from "@/lib/actions/products";
import type { Customer } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function NewDevicePage() {
  const [products, suppliers] = await Promise.all([
    getProductsForSelect().catch(() => []),
    getCustomers({ is_supplier: true }).catch((): Customer[] => []),
  ]);

  return (
    <div>
      <PageHeader
        title="Registrar dispositivo"
        description="Añade un nuevo dispositivo al inventario"
      />
      <DeviceForm products={products} suppliers={suppliers} />
    </div>
  );
}

import DeviceForm from "@/components/admin/DeviceForm";
import PageHeader from "@/components/admin/PageHeader";
import { getProductsForSelect } from "@/lib/actions/products";

export default async function NewDevicePage() {
  const products = await getProductsForSelect().catch(() => []);

  return (
    <div>
      <PageHeader
        title="Registrar dispositivo"
        description="Añade un nuevo dispositivo al inventario"
      />
      <DeviceForm products={products} />
    </div>
  );
}

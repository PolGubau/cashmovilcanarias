import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="Nuevo Producto" description="Crea un producto con sus variantes (capacidad, color, estado)" />
      <ProductForm />
    </div>
  );
}

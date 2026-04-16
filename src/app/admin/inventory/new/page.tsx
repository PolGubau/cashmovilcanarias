import PageHeader from "@/components/admin/PageHeader";
import DeviceForm from "@/components/admin/DeviceForm";

export default function NewDevicePage() {
  return (
    <div>
      <PageHeader
        title="Registrar dispositivo"
        description="Añade un nuevo dispositivo al inventario"
      />
      <DeviceForm />
    </div>
  );
}

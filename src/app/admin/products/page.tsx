import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/actions/products";
import { toggleProductPublished } from "@/lib/actions/products";
import type { ProductFull } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { Eye, EyeOff, Package, Plus, Smartphone } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = (await getProducts()) as ProductFull[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Productos"
        description={`${products.length} productos registrados`}
        action={
          <Link href="/admin/products/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Nuevo producto</Button>
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-3">
          <Package className="h-12 w-12 text-gray-4 mb-4" />
          <p className="text-dark font-medium">Sin productos aún</p>
          <p className="text-sm text-dark-4 mt-1">Crea tu primer producto para empezar a vender.</p>
          <Link href="/admin/products/new" className="mt-4">
            <Button size="sm">Crear producto</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-3 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-3 bg-gray-1">
                <th className="text-left py-3 px-4 font-medium text-dark-3">Producto</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">
                  Stock real
                  <span className="ml-1 text-[10px] text-dark-4 font-normal">(desde inventario)</span>
                </th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Desde</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Garantía</th>
                <th className="text-left py-3 px-4 font-medium text-dark-3">Estado</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-1 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {p.primary_image_url ? (
                        <img src={p.primary_image_url} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-gray-3" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-2 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-dark">{p.name}</p>
                        <p className="text-xs text-dark-4">{p.brand} · {Number(p.variant_count)} variantes</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={Number(p.total_stock) > 0 ? "success" : "danger"} dot>
                      {Number(p.total_stock)} uds
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-dark-3">
                    {p.price_from ? formatCurrency(p.price_from) : "-"}
                  </td>
                  <td className="py-3 px-4 text-dark-3">{p.warranty_months} meses</td>
                  <td className="py-3 px-4">
                    <Badge variant={p.is_published ? "success" : "default"}>
                      {p.is_published ? "Publicado" : "Borrador"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs font-medium text-blue hover:underline"
                    >
                      Ver / Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

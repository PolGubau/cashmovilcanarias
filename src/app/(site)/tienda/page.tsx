import shopData from "@/components/Shop/shopData";
import { getPublishedProducts } from "@/lib/actions/products";
import type { ProductWithRelations } from "@/lib/actions/products";
import type { ProductCondition } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";
import { Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuevo",
  excellent: "Como nuevo",
  good: "Bueno",
  fair: "Aceptable",
};

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; condition?: string }>;
}) {
  const sp = await searchParams;
  const fromDb = await getPublishedProducts({ brand: sp.brand }).catch(
    (): ProductWithRelations[] => [],
  );

  // Fall back to mock data when Supabase has no products yet
  const products: ProductWithRelations[] =
    fromDb.length > 0
      ? fromDb
      : shopData
        .filter((p) => !sp.brand || p.brand?.toLowerCase() === sp.brand.toLowerCase())
        .map((p) => ({
          ...p,
          description: p.description ?? null,
          product_variants: p.price_from
            ? [
              {
                id: `mock-v-${p.id}`,
                product_id: p.id,
                capacity: null,
                color: null,
                condition: "excellent" as ProductCondition,
                battery_health: null,
                stock: p.total_stock,
                price: p.price_from,
                purchase_price: null,
                sku: null,
                is_active: true,
                created_at: p.created_at,
                updated_at: p.updated_at,
              },
            ]
            : [],
          product_images: p.primary_image_url
            ? [
              {
                id: `mock-i-${p.id}`,
                product_id: p.id,
                url: p.primary_image_url,
                alt: p.name,
                sort_order: 0,
                is_primary: true,
                created_at: p.created_at,
              },
            ]
            : [],
        }));

  // Extract unique brands for filter
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter(Boolean) as string[]),
  );

  return (
    <section className="container pb-20 pt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark">
          Móviles de segunda mano
        </h1>
        <p className="text-dark-4 mt-1">
          Dispositivos verificados con garantía
        </p>
      </div>

      {/* Brand filters */}
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/tienda"
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${!sp.brand ? "bg-dark text-white border-dark" : "bg-white text-dark-3 border-gray-3 hover:border-dark"}`}
          >
            Todos
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand as string}
              href={`/tienda?brand=${brand}`}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${sp.brand === brand ? "bg-dark text-white border-dark" : "bg-white text-dark-3 border-gray-3 hover:border-dark"}`}
            >
              {brand as string}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-4 mb-4" />
          <p className="text-dark font-medium">No hay productos disponibles</p>
          <p className="text-sm text-dark-4 mt-1">
            Vuelve pronto, actualizamos el stock diariamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p: ProductWithRelations) => {
            const variants = p.product_variants ?? [];
            const minPrice = variants.reduce(
              (m, v) => Math.min(m, Number(v.price)),
              Number.POSITIVE_INFINITY,
            );
            const totalStock = variants.reduce(
              (s, v) => s + Number(v.stock),
              0,
            );
            const primaryImg =
              p.product_images?.find((i) => i.is_primary)?.url ??
              p.product_images?.[0]?.url;
            const conditions = Array.from(
              new Set(variants.map((v) => v.condition).filter(Boolean) as string[]),
            );

            return (
              <Link
                key={p.id}
                href={`/tienda/${p.id}`}
                className="group bg-white border border-gray-3 rounded-xl overflow-hidden hover:shadow-3 transition-shadow"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-1 relative">
                  {primaryImg ? (
                    <img
                      src={primaryImg}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-4" />
                    </div>
                  )}
                  {totalStock === 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-xs font-medium text-dark-3 bg-white border border-gray-3 px-2 py-1 rounded-full">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">
                    {p.brand}
                  </p>
                  <p className="font-semibold text-dark text-sm mt-0.5 line-clamp-2">
                    {p.name}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(conditions as string[]).slice(0, 2).map((c) => (
                      <span
                        key={c}
                        className="text-[10px] bg-gray-2 text-dark-4 px-1.5 py-0.5 rounded-full"
                      >
                        {CONDITION_LABEL[c] ?? c}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-base font-bold text-dark">
                      {Number.isFinite(minPrice)
                        ? `Desde ${formatCurrency(minPrice)}`
                        : "-"}
                    </p>
                    <span className="text-xs text-green font-medium">
                      {p.warranty_months}m garantía
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

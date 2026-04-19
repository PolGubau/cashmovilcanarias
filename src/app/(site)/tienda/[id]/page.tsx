import ProductItem from "@/components/Common/ProductItem";
import { ProductImageGallery } from "@/components/Shop/ProductImageGallery";
import ProductVariantSelector from "@/components/Shop/ProductVariantSelector";
import { getProductById, getProducts } from "@/lib/actions/products";
import type { ProductFull, ProductImage, ProductVariant } from "@/lib/supabase/types";
import { ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuevo",
  like_new: "Seminuevo",
};

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getProductById(id).catch(() => null);
  const name = result?.product?.name ?? "Producto";
  return {
    title: `${name} | CashMóvil Canarias`,
    description: result?.product?.description ?? `Compra ${name} reacondicionado con garantía.`,
  };
}

export default async function ProductDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProductById(id).catch(() => null);
  if (!result?.product) notFound();

  const { product, variants, images } = result;
  const activeVariants = variants.filter(
    (v: ProductVariant) => v.is_active && v.stock > 0,
  );
  const primaryImg =
    images.find((i: ProductImage) => i.is_primary)?.url ?? images[0]?.url ?? null;

  const galleryImages = images.map((i: ProductImage) => ({
    id: i.id,
    url: i.url,
    alt: i.alt,
  }));

  // Related: same brand, same category if available, exclude current product
  const related = await getProducts({
    published: true,
    ...(product.category ? { category: product.category } : { brand: product.brand }),
  }).then((all) => all.filter((p) => p.id !== id).slice(0, 4)).catch(() => []);

  return (
    <>
      <section className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0 py-8 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Gallery */}
          <ProductImageGallery images={galleryImages} productName={product.name} />

          {/* Details */}
          <div className="flex flex-col px-1 sm:px-0">
            <p className="text-xs font-semibold text-dark-4 uppercase tracking-widest">
              {product.brand}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-dark mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Trust row */}
            <div className="flex flex-wrap gap-3 mt-3">
              {product.warranty_months > 0 && (
                <span className="flex items-center gap-1.5 text-sm text-green">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  {product.warranty_months} meses de garantía
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-dark-4">
                <Truck className="h-4 w-4 shrink-0" />
                Envío a Canarias
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-dark-3 text-sm mt-4 leading-relaxed border-t border-gray-3 pt-4">
                {product.description}
              </p>
            )}

            {/* Variant selector */}
            <div className="mt-6">
              {activeVariants.length === 0 ? (
                <div className="bg-gray-1 rounded-xl p-6 text-center">
                  <p className="text-dark-3 font-medium">Sin stock disponible</p>
                  <p className="text-sm text-dark-4 mt-1">
                    Contacta con nosotros para disponibilidad.
                  </p>
                </div>
              ) : (
                <ProductVariantSelector
                  variants={activeVariants}
                  conditionLabels={CONDITION_LABEL}
                  productId={product.id}
                  productName={product.name}
                  brand={product.brand}
                  primaryImageUrl={primaryImg}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-gray-2 py-14">
          <div className="max-w-[1170px] mx-auto px-4 sm:px-6 xl:px-0">
            <h2 className="font-semibold text-xl text-dark mb-6">
              También te puede interesar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item: ProductFull) => (
                <ProductItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

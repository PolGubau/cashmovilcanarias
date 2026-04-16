import ProductVariantSelector from "@/components/Shop/ProductVariantSelector";
import { getProductById } from "@/lib/actions/products";
import { formatCurrency } from "@/lib/utils";
import { Package, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CONDITION_LABEL: Record<string, string> = {
  new: "Nuevo", excellent: "Como nuevo", good: "Bueno", fair: "Aceptable",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProductById(id).catch(() => null);
  if (!result || !result.product) notFound();

  const { product, variants, images } = result;
  const activeVariants = (variants as any[]).filter((v: any) => v.is_active && v.stock > 0);
  const primaryImg = (images as any[]).find((i: any) => i.is_primary)?.url ?? (images as any[])[0]?.url;

  return (
    <section className="container py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-1 rounded-2xl overflow-hidden border border-gray-3">
            {primaryImg ? (
              <img src={primaryImg} alt={(product as any).name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-20 w-20 text-gray-4" />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {(images as any[]).map((img: any) => (
                <img key={img.id} src={img.url} alt={img.alt ?? ""} className="h-16 w-16 rounded-lg object-cover border border-gray-3 cursor-pointer hover:border-blue transition-colors" />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <p className="text-sm font-medium text-dark-4 uppercase tracking-widest">{(product as any).brand}</p>
          <h1 className="text-2xl font-bold text-dark mt-1">{(product as any).name}</h1>

          {/* Warranty badge */}
          <div className="flex items-center gap-2 mt-3 text-green">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">{(product as any).warranty_months} meses de garantía</span>
          </div>

          {/* Description */}
          {(product as any).description && (
            <p className="text-dark-3 text-sm mt-4 leading-relaxed">{(product as any).description}</p>
          )}

          {/* Variant selector + checkout */}
          <div className="mt-6 flex-1">
            {activeVariants.length === 0 ? (
              <div className="bg-gray-1 rounded-xl p-6 text-center">
                <p className="text-dark-3 font-medium">Sin stock disponible</p>
                <p className="text-sm text-dark-4 mt-1">Contacta con nosotros para disponibilidad.</p>
              </div>
            ) : (
              <ProductVariantSelector variants={activeVariants} conditionLabels={CONDITION_LABEL} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

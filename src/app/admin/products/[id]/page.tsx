import DeleteProductButton from "@/components/admin/DeleteProductButton";
import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/supabase/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getProductById(id).catch(() => null);
  if (!result) notFound();

  const { product, variants, images } = result;
  const categoryLabel = product.category
    ? (PRODUCT_CATEGORIES[product.category] ?? product.category)
    : null;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-sm text-dark-4 hover:text-dark transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <PageHeader
        title={product.name}
        description={[
          product.brand,
          categoryLabel,
          `${variants.length} variante${variants.length !== 1 ? "s" : ""}`,
          `${images.length} imagen${images.length !== 1 ? "es" : ""}`,
        ]
          .filter(Boolean)
          .join(" · ")}
        action={<DeleteProductButton productId={product.id} />}
      />

      <ProductForm
        initialProduct={product}
        initialVariants={variants}
        initialImages={images}
      />
    </div>
  );
}

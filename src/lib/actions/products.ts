"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  ProductInsert,
  ProductUpdate,
  ProductVariantInsert,
  ProductVariantUpdate,
} from "@/lib/supabase/types";

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(filters?: { published?: boolean; brand?: string; search?: string }) {
  const supabase = await createClient();
  let query = (supabase.from("v_products_full" as any).select("*") as any).order("created_at", { ascending: false });
  if (filters?.published !== undefined) query = query.eq("is_published", filters.published);
  if (filters?.brand) query = query.ilike("brand", `%${filters.brand}%`);
  if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,base_model.ilike.%${filters.search}%`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const [productRes, variantsRes, imagesRes] = await Promise.all([
    supabase.from("products" as any).select("*").eq("id", id).single(),
    supabase.from("product_variants" as any).select("*").eq("product_id", id).eq("is_active", true).order("price"),
    supabase.from("product_images" as any).select("*").eq("product_id", id).order("sort_order"),
  ]);
  if (productRes.error) throw new Error(productRes.error.message);
  return {
    product: productRes.data,
    variants: variantsRes.data ?? [],
    images: imagesRes.data ?? [],
  };
}

export async function createProduct(
  product: ProductInsert,
  variants: Omit<ProductVariantInsert, "product_id">[],
) {
  const supabase = await createClient();
  const { data: prod, error } = await (supabase.from("products" as any).insert(product).select().single() as any);
  if (error) throw new Error(error.message);

  if (variants.length > 0) {
    const rows = variants.map((v) => ({ ...v, product_id: prod.id }));
    const { error: ve } = await supabase.from("product_variants" as any).insert(rows);
    if (ve) throw new Error(ve.message);
  }

  revalidatePath("/admin/products");
  return prod;
}

export async function updateProduct(id: string, updates: ProductUpdate) {
  const supabase = await createClient();
  const { data, error } = await (supabase.from("products" as any).update(updates).eq("id", id).select().single() as any);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return data;
}

export async function toggleProductPublished(id: string, published: boolean) {
  return updateProduct(id, { is_published: published });
}

// ─── Variants ────────────────────────────────────────────────────────────────

export async function createVariant(variant: ProductVariantInsert) {
  const supabase = await createClient();
  const { data, error } = await (supabase.from("product_variants" as any).insert(variant).select().single() as any);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${variant.product_id}`);
  return data;
}

export async function updateVariant(id: string, updates: ProductVariantUpdate, productId: string) {
  const supabase = await createClient();
  const { data, error } = await (supabase.from("product_variants" as any).update(updates).eq("id", id).select().single() as any);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
  return data;
}

export async function deleteVariant(id: string, productId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("product_variants" as any).update({ is_active: false }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/products/${productId}`);
}

// ─── Public catalog ──────────────────────────────────────────────────────────

export async function getPublishedProducts(filters?: { brand?: string; condition?: string; maxPrice?: number }) {
  const supabase = await createClient();
  let query = (supabase.from("products" as any)
    .select("*, product_variants(*), product_images(*)") as any)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (filters?.brand) query = query.ilike("brand", `%${filters.brand}%`);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

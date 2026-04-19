"use server";

import { createClient } from "@/lib/supabase/server";
import type {
	Product,
	ProductCategory,
	ProductFull,
	ProductImage,
	ProductInsert,
	ProductUpdate,
	ProductVariant,
	ProductVariantInsert,
	ProductVariantUpdate,
} from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export type ProductWithRelations = Product & {
	product_variants: ProductVariant[];
	product_images: ProductImage[];
};

// ─── Products ────────────────────────────────────────────────────────────────

export async function getProducts(filters?: {
	published?: boolean;
	brand?: string;
	category?: ProductCategory;
	search?: string;
}): Promise<ProductFull[]> {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("v_products_full")
		.select("*")
		.order("created_at", { ascending: false });
	if (filters?.published !== undefined)
		query = query.eq("is_published", filters.published);
	if (filters?.brand) query = query.ilike("brand", `%${filters.brand}%`);
	if (filters?.category) query = query.eq("category", filters.category);
	if (filters?.search)
		query = query.or(
			`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,base_model.ilike.%${filters.search}%`,
		);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data ?? [];
}

export async function getProductById(id: string): Promise<{
	product: Product;
	variants: ProductVariant[];
	images: ProductImage[];
}> {
	const supabase = (await createClient()) as any;
	const [productRes, variantsRes, imagesRes] = await Promise.all([
		supabase.from("products").select("*").eq("id", id).single(),
		supabase
			.from("product_variants")
			.select("*")
			.eq("product_id", id)
			.eq("is_active", true)
			.order("price"),
		supabase
			.from("product_images")
			.select("*")
			.eq("product_id", id)
			.order("sort_order"),
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
): Promise<Product> {
	const supabase = (await createClient()) as any;
	const { data: prod, error } = await supabase
		.from("products")
		.insert(product)
		.select()
		.single();
	if (error) throw new Error(error.message);

	if (variants.length > 0) {
		const rows = variants.map((v) => ({ ...v, product_id: prod.id }));
		const { error: ve } = await supabase.from("product_variants").insert(rows);
		if (ve) throw new Error(ve.message);
	}

	revalidatePath("/admin/products");
	return prod;
}

export async function updateProduct(
	id: string,
	updates: ProductUpdate,
): Promise<Product> {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("products")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath("/admin/products");
	revalidatePath(`/admin/products/${id}`);
	return data;
}

export async function toggleProductPublished(
	id: string,
	published: boolean,
): Promise<Product> {
	return updateProduct(id, { is_published: published });
}

// ─── Variants ────────────────────────────────────────────────────────────────

export async function createVariant(
	variant: ProductVariantInsert,
): Promise<ProductVariant> {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("product_variants")
		.insert(variant)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath(`/admin/products/${variant.product_id}`);
	return data;
}

export async function updateVariant(
	id: string,
	updates: ProductVariantUpdate,
	productId: string,
): Promise<ProductVariant> {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("product_variants")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
	if (error) throw new Error(error.message);
	revalidatePath(`/admin/products/${productId}`);
	return data;
}

export async function deleteVariant(
	id: string,
	productId: string,
): Promise<void> {
	const supabase = (await createClient()) as any;
	const { error } = await supabase
		.from("product_variants")
		.update({ is_active: false })
		.eq("id", id);
	if (error) throw new Error(error.message);
	revalidatePath(`/admin/products/${productId}`);
}

// ─── Public catalog ──────────────────────────────────────────────────────────

export async function getPublishedProducts(filters?: {
	brand?: string;
	category?: ProductCategory;
	condition?: string;
	search?: string;
	maxPrice?: number;
}): Promise<ProductWithRelations[]> {
	const supabase = (await createClient()) as any;
	let query = supabase
		.from("products")
		.select("*, product_variants(*), product_images(*)")
		.eq("is_published", true)
		.order("created_at", { ascending: false });

	if (filters?.brand) query = query.ilike("brand", `%${filters.brand}%`);
	if (filters?.category) query = query.eq("category", filters.category);
	if (filters?.search)
		query = query.or(
			`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,base_model.ilike.%${filters.search}%`,
		);

	const { data, error } = await query;
	if (error) throw new Error(error.message);

	// condition filter applied in-memory on variants
	let results = (data ?? []) as ProductWithRelations[];
	if (filters?.condition) {
		results = results.filter((p) =>
			p.product_variants?.some(
				(v) => v.condition === filters.condition && v.is_active && v.stock > 0,
			),
		);
	}
	return results;
}

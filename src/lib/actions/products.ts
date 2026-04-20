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

// ─── Images ──────────────────────────────────────────────────────────────────

export async function uploadProductImage(
	productId: string,
	formData: FormData,
): Promise<ProductImage> {
	const supabase = (await createClient()) as any;
	const file = formData.get("file") as File;
	if (!file) throw new Error("No file provided");

	const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
	const path = `${productId}/${Date.now()}.${ext}`;

	const { error: storageErr } = await supabase.storage
		.from("product-images")
		.upload(path, file, { contentType: file.type });
	if (storageErr) throw new Error(storageErr.message);

	const {
		data: { publicUrl },
	} = supabase.storage.from("product-images").getPublicUrl(path);

	const { count } = await supabase
		.from("product_images")
		.select("id", { count: "exact", head: true })
		.eq("product_id", productId);

	const { data, error } = await supabase
		.from("product_images")
		.insert({
			product_id: productId,
			url: publicUrl,
			alt: file.name.replace(/\.[^.]+$/, ""),
			sort_order: count ?? 0,
			is_primary: (count ?? 0) === 0,
		})
		.select()
		.single();
	if (error) throw new Error(error.message);

	revalidatePath(`/admin/products/${productId}`);
	revalidatePath("/admin/products");
	return data;
}

export async function deleteProductImage(
	imageId: string,
	productId: string,
): Promise<void> {
	const supabase = (await createClient()) as any;
	const { data: img } = await supabase
		.from("product_images")
		.select("url, is_primary")
		.eq("id", imageId)
		.single();

	const { error } = await supabase
		.from("product_images")
		.delete()
		.eq("id", imageId);
	if (error) throw new Error(error.message);

	if (img?.url) {
		try {
			const url = new URL(img.url);
			const storagePath = url.pathname.split("/product-images/")[1];
			if (storagePath) {
				await supabase.storage.from("product-images").remove([storagePath]);
			}
		} catch {
			// Storage cleanup is best-effort
		}
	}

	if (img?.is_primary) {
		const { data: next } = await supabase
			.from("product_images")
			.select("id")
			.eq("product_id", productId)
			.order("sort_order")
			.limit(1)
			.maybeSingle();
		if (next) {
			await supabase
				.from("product_images")
				.update({ is_primary: true })
				.eq("id", next.id);
		}
	}

	revalidatePath(`/admin/products/${productId}`);
	revalidatePath("/admin/products");
}

export async function setPrimaryImage(
	imageId: string,
	productId: string,
): Promise<void> {
	const supabase = (await createClient()) as any;
	await supabase
		.from("product_images")
		.update({ is_primary: false })
		.eq("product_id", productId);
	const { error } = await supabase
		.from("product_images")
		.update({ is_primary: true })
		.eq("id", imageId);
	if (error) throw new Error(error.message);
	revalidatePath(`/admin/products/${productId}`);
	revalidatePath("/admin/products");
}

const BROWSER_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
	Accept:
		"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
	"Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
	"Accept-Encoding": "gzip, deflate, br",
	"Cache-Control": "no-cache",
	Pragma: "no-cache",
};

export async function importImageFromUrl(
	productId: string,
	pageUrl: string,
): Promise<ProductImage> {
	const isDirectImage = /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i.test(pageUrl);
	let imageUrl = isDirectImage ? pageUrl : "";

	if (!isDirectImage) {
		// Amazon blocks server-side scrapers — guide the user to paste a direct image URL
		if (/amazon\.(com|es|co\.uk|de|fr|it)/i.test(pageUrl)) {
			throw new Error(
				'Amazon bloquea la importación automática. En la página del producto, haz clic derecho sobre la imagen → "Copiar imagen" y luego pégala aquí con Ctrl+V.',
			);
		}

		const res = await fetch(pageUrl, { headers: BROWSER_HEADERS });
		if (!res.ok)
			throw new Error(
				`No se pudo acceder a la URL (${res.status}). Prueba a copiar la imagen directamente.`,
			);
		const html = await res.text();

		// Try og:image and twitter:image in all attribute orderings
		const ogMatch =
			html.match(
				/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
			) ??
			html.match(
				/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
			) ??
			html.match(
				/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
			) ??
			html.match(
				/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
			);

		if (!ogMatch?.[1])
			throw new Error(
				"No se encontró imagen en esa página. Copia la imagen directamente con Ctrl+V.",
			);

		imageUrl = ogMatch[1];
		if (imageUrl.startsWith("/")) {
			const base = new URL(pageUrl);
			imageUrl = `${base.protocol}//${base.host}${imageUrl}`;
		}
	}

	const imgRes = await fetch(imageUrl, { headers: BROWSER_HEADERS });
	if (!imgRes.ok) throw new Error("No se pudo descargar la imagen");

	const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
	const ext = contentType.includes("png")
		? "png"
		: contentType.includes("webp")
			? "webp"
			: contentType.includes("gif")
				? "gif"
				: "jpg";
	const buffer = await imgRes.arrayBuffer();
	const file = new File([buffer], `import.${ext}`, {
		type: contentType.split(";")[0],
	});
	const fd = new FormData();
	fd.append("file", file);
	return uploadProductImage(productId, fd);
}

// ─── Selectors (for forms) ───────────────────────────────────────────────────

export interface ProductOption {
	id: string;
	name: string;
	brand: string;
	base_model: string;
}

export interface VariantOption {
	id: string;
	product_id: string;
	capacity: string | null;
	color: string | null;
	condition: string | null;
	price: number;
	/** Stock from linked devices (in_stock status) */
	device_stock: number;
}

export async function getProductsForSelect(): Promise<ProductOption[]> {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("products")
		.select("id, name, brand, base_model")
		.order("brand")
		.order("name");
	if (error) throw new Error(error.message);
	return data ?? [];
}

export async function getVariantsForSelect(
	productId: string,
): Promise<VariantOption[]> {
	const supabase = (await createClient()) as any;
	const { data, error } = await supabase
		.from("product_variants")
		.select("id, product_id, capacity, color, condition, price")
		.eq("product_id", productId)
		.eq("is_active", true)
		.order("price");
	if (error) throw new Error(error.message);

	// Enrich with live device stock count
	const variantIds = (data ?? []).map((v: any) => v.id);
	if (variantIds.length === 0) return [];

	const { data: devices } = await supabase
		.from("devices")
		.select("product_variant_id")
		.in("product_variant_id", variantIds)
		.eq("status", "in_stock");

	const stockMap: Record<string, number> = {};
	for (const d of devices ?? []) {
		stockMap[d.product_variant_id] = (stockMap[d.product_variant_id] ?? 0) + 1;
	}

	return (data ?? []).map((v: any) => ({
		...v,
		device_stock: stockMap[v.id] ?? 0,
	}));
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
	// Stock is now derived from physical devices; v.stock is kept for legacy compat
	let results = (data ?? []) as ProductWithRelations[];
	if (filters?.condition) {
		results = results.filter((p) =>
			p.product_variants?.some(
				(v) => v.condition === filters.condition && v.is_active,
			),
		);
	}
	return results;
}

import type { ProductImage, ProductVariant } from "@/lib/supabase/types";
import type { Product } from "@/lib/supabase/types";

export const STORE_PAGE_SIZE = 16;

export type ProductWithRelations = Product & {
	product_variants: ProductVariant[];
	product_images: ProductImage[];
};

export type PaginatedProducts = {
	products: ProductWithRelations[];
	total: number;
};

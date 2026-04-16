// Re-export Supabase types so storefront components stay aligned with the DB schema.
// When Supabase is live, swap the import source from mock data to the real actions.
export type {
	ProductFull as Product,
	ProductFull,
	ProductVariant,
	ProductImage,
	ProductCondition,
} from "@/lib/supabase/types";

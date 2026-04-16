// Matches a potential Supabase view/query that aggregates product brands as categories.
export type Category = {
	id: string;
	name: string;
	image_url: string | null;
};

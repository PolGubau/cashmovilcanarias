// Supports both static home categories data and Supabase-backed category rows.
export type Category = {
	id: string | number;
	name?: string;
	image_url?: string | null;
	title?: string;
	img?: string;
};

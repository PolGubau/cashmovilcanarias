import type { ProductFull } from "@/lib/supabase/types";
import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
	value: ProductFull;
};

const emptyProduct: ProductFull = {
	id: "",
	name: "",
	brand: "",
	base_model: "",
	description: null,
	warranty_months: 0,
	is_published: false,
	created_at: "",
	updated_at: "",
	primary_image_url: null,
	variant_count: 0,
	total_stock: 0,
	price_from: null,
};

const initialState: InitialState = { value: emptyProduct };

export const quickView = createSlice({
	name: "quickView",
	initialState,
	reducers: {
		updateQuickView: (_, action) => {
			return {
				value: {
					...action.payload,
				},
			};
		},

		resetQuickView: () => {
			return {
				value: initialState.value,
			};
		},
	},
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;

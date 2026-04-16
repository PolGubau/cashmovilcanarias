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

export const productDetails = createSlice({
	name: "productDetails",
	initialState,
	reducers: {
		updateproductDetails: (_, action) => {
			return {
				value: {
					...action.payload,
				},
			};
		},
	},
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;

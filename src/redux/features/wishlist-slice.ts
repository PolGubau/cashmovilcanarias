import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

type InitialState = {
	items: WishListItem[];
};

// WishListItem mirrors ProductFull fields needed for display.
export type WishListItem = {
	id: string;
	name: string;
	brand: string;
	price: number;
	primary_image_url: string | null;
	quantity: number;
};

const initialState: InitialState = {
	items: [],
};

export const wishlist = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id,
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push({ ...action.payload });
			}
		},
		removeItemFromWishlist: (state, action: PayloadAction<string>) => {
			const itemId = action.payload;
			state.items = state.items.filter((item) => item.id !== itemId);
		},

		removeAllItemsFromWishlist: (state) => {
			state.items = [];
		},
	},
});

export const {
	addItemToWishlist,
	removeItemFromWishlist,
	removeAllItemsFromWishlist,
} = wishlist.actions;
export default wishlist.reducer;

import {
	type PayloadAction,
	createSelector,
	createSlice,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";

type InitialState = {
	items: CartItem[];
};

// CartItem mirrors ProductFull + chosen quantity.
// id = product UUID (or variant UUID when variants are used).
export type CartItem = {
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

export const cart = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addItemToCart: (state, action: PayloadAction<CartItem>) => {
			const existingItem = state.items.find(
				(item) => item.id === action.payload.id,
			);
			if (existingItem) {
				existingItem.quantity += action.payload.quantity;
			} else {
				state.items.push({ ...action.payload });
			}
		},
		removeItemFromCart: (state, action: PayloadAction<string>) => {
			const itemId = action.payload;
			state.items = state.items.filter((item) => item.id !== itemId);
		},
		updateCartItemQuantity: (
			state,
			action: PayloadAction<{ id: string; quantity: number }>,
		) => {
			const { id, quantity } = action.payload;
			const existingItem = state.items.find((item) => item.id === id);

			if (existingItem) {
				existingItem.quantity = quantity;
			}
		},

		removeAllItemsFromCart: (state) => {
			state.items = [];
		},
	},
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
	return items.reduce((total, item) => {
		return total + item.price * item.quantity;
	}, 0);
});

export const {
	addItemToCart,
	removeItemFromCart,
	updateCartItemQuantity,
	removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;

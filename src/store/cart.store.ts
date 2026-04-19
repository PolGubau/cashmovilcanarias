import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
	id: string;
	name: string;
	brand: string;
	price: number;
	primary_image_url: string | null;
	quantity: number;
};

type CartStore = {
	items: CartItem[];
	// computed
	totalPrice: () => number;
	totalItems: () => number;
	// actions
	addItem: (item: CartItem) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],

			totalPrice: () =>
				get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

			totalItems: () =>
				get().items.reduce((sum, item) => sum + item.quantity, 0),

			addItem: (item) =>
				set((state) => {
					const existing = state.items.find((i) => i.id === item.id);
					if (existing) {
						return {
							items: state.items.map((i) =>
								i.id === item.id
									? { ...i, quantity: i.quantity + item.quantity }
									: i,
							),
						};
					}
					return { items: [...state.items, item] };
				}),

			removeItem: (id) =>
				set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

			updateQuantity: (id, quantity) =>
				set((state) => ({
					items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
				})),

			clearCart: () => set({ items: [] }),
		}),
		{ name: "cart-storage" },
	),
);

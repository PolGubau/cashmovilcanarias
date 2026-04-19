import type { ProductFull } from "@/lib/supabase/types";
import { create } from "zustand";

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

type UIStore = {
  // Quick view modal
  isQuickViewOpen: boolean;
  quickViewProduct: ProductFull;
  openQuickView: (product: ProductFull) => void;
  closeQuickView: () => void;

  // Cart sidebar modal
  isCartSidebarOpen: boolean;
  openCartSidebar: () => void;
  closeCartSidebar: () => void;

  // Preview slider modal
  isPreviewSliderOpen: boolean;
  previewProduct: ProductFull;
  openPreviewSlider: (product: ProductFull) => void;
  closePreviewSlider: () => void;
};

export const useUIStore = create<UIStore>()((set) => ({
  // Quick view
  isQuickViewOpen: false,
  quickViewProduct: emptyProduct,
  openQuickView: (product) =>
    set({ isQuickViewOpen: true, quickViewProduct: product }),
  closeQuickView: () =>
    set({ isQuickViewOpen: false, quickViewProduct: emptyProduct }),

  // Cart sidebar
  isCartSidebarOpen: false,
  openCartSidebar: () => set({ isCartSidebarOpen: true }),
  closeCartSidebar: () => set({ isCartSidebarOpen: false }),

  // Preview slider
  isPreviewSliderOpen: false,
  previewProduct: emptyProduct,
  openPreviewSlider: (product) =>
    set({ isPreviewSliderOpen: true, previewProduct: product }),
  closePreviewSlider: () =>
    set({ isPreviewSliderOpen: false, previewProduct: emptyProduct }),
}));

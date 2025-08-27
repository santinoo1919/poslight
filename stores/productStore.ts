import { create } from "zustand";
import { store } from "../services/tinybaseStore";
import {
  filterProductsByCategory,
  searchProductsByName,
} from "../utils/productHelpers";
import type { Product, Category } from "../types/database";

interface ProductState {
  // State
  products: Product[] | null;
  categories: Category[] | null;
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
  searchResults: Product[];
  isFiltering: boolean;
  visibleProducts: Product[];

  // Actions
  setProducts: (products: Product[] | null) => void;
  setCategories: (categories: Category[] | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentCategory: (category: string | null) => void;
  setSearchResults: (results: Product[]) => void;
  setIsFiltering: (isFiltering: boolean) => void;

  // Business Logic
  handleCategorySelect: (categoryName: string) => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  resetProducts: () => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Stock Update Callback (for cart integration)
  setStockUpdateCallback: (
    callback: (productId: string, newStock: number) => void
  ) => void;

  // Computed
  getProductsByCategory: (categoryName: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state - start with loading true and null for data
  products: null,
  categories: null,
  loading: true,
  error: null,
  currentCategory: null,
  searchResults: [],
  isFiltering: false,
  visibleProducts: [],

  // Basic setters
  setProducts: (products) => {
    console.log("📦 Product Store: Setting products:", products?.length || 0);
    set({ products });
  },
  setCategories: (categories) => {
    console.log(
      "🏷️ Product Store: Setting categories:",
      categories?.length || 0
    );
    set({ categories });
  },
  setLoading: (loading) => {
    console.log("⏳ Product Store: Setting loading:", loading);
    set({ loading });
  },
  setError: (error) => set({ error }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsFiltering: (isFiltering) => set({ isFiltering }),

  // Business Logic
  handleCategorySelect: (categoryName: string) => {
    console.log("🏷️ Product Store: Category selected:", categoryName);

    if (categoryName === "Show All") {
      set({ currentCategory: null });
      return;
    }

    set({ currentCategory: categoryName });
  },

  handleSearch: (query: string) => {
    console.log("🔍 Product Store: Search query:", query);

    if (!query.trim()) {
      set({ searchResults: [] });
      return;
    }

    const state = get();
    if (!state.products) return;

    const results = searchProductsByName(state.products, query);
    set({ searchResults: results });
  },

  clearSearch: () => {
    console.log("🧹 Product Store: Clearing search");
    set({ searchResults: [] });
  },

  resetProducts: () => {
    console.log("🔄 Product Store: Resetting products");
    // This would typically reload products from the source
    // For now, just clear any errors
    set({ error: null });
  },

  updateProductStock: (productId: string, newStock: number) => {
    console.log(
      "📦 Product Store: Updating stock for",
      productId,
      "to",
      newStock
    );

    set((state) => ({
      products:
        state.products?.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        ) || null,
    }));
  },

  // Stock Update Callback (for cart integration)
  setStockUpdateCallback: (
    callback: (productId: string, newStock: number) => void
  ) => {
    // This is a placeholder. In a real app, you'd manage subscriptions here
    // For now, we'll just store the callback.
    // In a more robust solution, you might have a global subscription manager
    // that handles multiple callbacks for different parts of the app.
    // For this example, we'll just store it.
    // set({ stockUpdateCallback: callback }); // This would require a new state variable
  },

  // Computed values
  getProductsByCategory: (categoryName: string) => {
    const state = get();
    if (!state.products) return [];
    return filterProductsByCategory(state.products, categoryName);
  },
}));

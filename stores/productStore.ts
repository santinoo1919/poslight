import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../services/tinybaseStore";
import {
  filterProductsByCategory,
  searchProductsByName,
} from "../utils/productHelpers";
import type { Product, Category } from "../types/database";
import { Inventory } from "../types/components";

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
  inventory: Inventory[];

  // Actions
  setProducts: (products: Product[] | null) => void;
  setCategories: (categories: Category[] | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentCategory: (category: string | null) => void;
  setSearchResults: (results: Product[]) => void;
  setIsFiltering: (isFiltering: boolean) => void;
  setInventory: (inventory: Inventory[]) => void;

  // Business Logic
  handleCategorySelect: (categoryName: string) => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  resetProducts: () => void;
  updateProductStock: (productId: string, newStock: number) => void;

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
  inventory: [],

  // Basic setters
  setProducts: (products) => set({ products }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentCategory: (category) => set({ currentCategory: category }),
  setSearchResults: (results) => set({ searchResults: results }),
  setIsFiltering: (isFiltering) => set({ isFiltering }),
  setInventory: (inventory) => set({ inventory }),

  // Business Logic
  handleCategorySelect: (categoryKey: string) => {
    // Handle "show-all" as null (show all products)
    set({ currentCategory: categoryKey === "show-all" ? null : categoryKey });
  },

  handleSearch: (query: string) => {
    const state = get();
    if (!query.trim() || !state.products) {
      set({ searchResults: [] });
      return;
    }
    set({ searchResults: searchProductsByName(state.products, query) });
  },

  clearSearch: () => set({ searchResults: [] }),

  resetProducts: () => set({ error: null }),

  updateProductStock: (productId: string, newStock: number) => {
    set((state) => ({
      products:
        state.products?.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        ) || null,
    }));
  },

  // Computed values
  getProductsByCategory: (categoryName: string) => {
    const { products } = get();
    return products ? filterProductsByCategory(products, categoryName) : [];
  },
}));

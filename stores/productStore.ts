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
  syncInventoryFromTinyBase: () => void;
  refreshProducts: () => void;
  initializeProducts: () => void;
  clearAllData: () => void;

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
      inventory: (state.inventory || []).map((item) =>
        item.product_id === productId
          ? { ...item, stock: newStock, updated_at: new Date().toISOString() }
          : item
      ),
    }));
  },

  // Sync inventory state from TinyBase (single source of truth)
  syncInventoryFromTinyBase: () => {
    try {
      const { db } = require("../services/tinybaseStore");
      const inventory = db.getAllInventory();

      console.log(
        "🔄 Syncing inventory from TinyBase:",
        inventory.length,
        "items"
      );

      set((state) => ({
        inventory,
      }));
    } catch (error) {
      console.error("Error syncing inventory from TinyBase:", error);
    }
  },

  refreshProducts: () => {
    try {
      // Import db here to avoid circular dependency
      const { db } = require("../services/tinybaseStore");
      const products = db.getProducts();
      const categories = db.getCategories();
      const inventory = db.getAllInventory();

      console.log("🔄 Refreshing products:", products.length, "products found");
      console.log("📦 Inventory:", inventory.length, "inventory items found");
      console.log(
        "📦 Products:",
        products.map((p) => ({ id: p.id, name: p.name, category: p.category }))
      );

      set({
        products,
        categories,
        inventory,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error refreshing products:", error);
      set({
        error: "Failed to load products",
        loading: false,
      });
    }
  },

  initializeProducts: () => {
    try {
      // Import db here to avoid circular dependency
      const { db } = require("../services/tinybaseStore");
      const products = db.getProducts();
      const categories = db.getCategories();
      const inventory = db.getAllInventory();

      console.log(
        "🚀 Initializing products from TinyBase:",
        products.length,
        "products found"
      );
      console.log("📦 Inventory:", inventory.length, "inventory items found");

      set({
        products,
        categories,
        inventory,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error initializing products:", error);
      set({
        error: "Failed to initialize products",
        loading: false,
      });
    }
  },

  clearAllData: () => {
    try {
      // Clear AsyncStorage
      AsyncStorage.removeItem("tinybase_store");

      // Clear Zustand state
      set({
        products: null,
        categories: null,
        loading: false,
        error: null,
        currentCategory: null,
        searchResults: [],
        isFiltering: false,
        visibleProducts: [],
        inventory: [],
      });

      console.log("🧹 Cleared all cached data - ready for fresh start");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  },

  // Computed values
  getProductsByCategory: (categoryName: string) => {
    const { products } = get();
    return products ? filterProductsByCategory(products, categoryName) : [];
  },
}));

import { create } from "zustand";
import { calculateSaleTotals } from "../utils/productHelpers";
import { ToastService } from "../services/toastService";
import type { Product } from "../types/database";
import type { CartProduct } from "../types/components";
import type { ProductWithInventory } from "../types/components";
import { useAuthStore } from "./authStore";
import * as Crypto from "expo-crypto";

interface CartState {
  // Cart State
  selectedProducts: CartProduct[];

  // UI State (kept for compatibility)
  selectedProductForQuantity: ProductWithInventory | null;
  keypadInput: string;

  // Cart Actions
  setSelectedProductForQuantity: (product: ProductWithInventory | null) => void;
  setKeypadInput: (input: string | ((prev: string) => string)) => void;
  addToCart: (product: ProductWithInventory, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getTotalAmount: () => number;
  completeSale: () => void;
  clearCart: () => void;

  // Event Handlers (kept for compatibility)
  handleProductPress: (product: ProductWithInventory) => void;
  handleKeypadNumber: (num: string) => void;
  handleKeypadDelete: () => void;
  handleKeypadClear: () => void;
  handleKeypadEnter: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  selectedProducts: [],
  selectedProductForQuantity: null,
  keypadInput: "",

  // Actions
  setSelectedProductForQuantity: (product) =>
    set({ selectedProductForQuantity: product }),

  setKeypadInput: (input: string | ((prev: string) => string)) => {
    if (typeof input === "function") {
      set((state) => ({ keypadInput: input(state.keypadInput) }));
    } else {
      set({ keypadInput: input });
    }
  },

  addToCart: (product, quantity) => {
    // Simple stock validation (like other stores do simple validation)
    const existing = get().selectedProducts.find((p) => p.id === product.id);
    const currentCartQuantity = existing ? existing.quantity : 0;
    const totalRequested = currentCartQuantity + quantity;

    set((state) => {
      const existing = state.selectedProducts.find((p) => p.id === product.id);
      if (existing) {
        // Replace quantity instead of adding to it
        return {
          selectedProducts: state.selectedProducts.map((p) =>
            p.id === product.id ? { ...p, quantity: quantity } : p
          ),
        };
      }
      return {
        selectedProducts: [...state.selectedProducts, { ...product, quantity }],
      };
    });
  },

  removeFromCart: (productId) =>
    set((state) => ({
      selectedProducts: state.selectedProducts.filter(
        (p) => p.id !== productId
      ),
    })),

  updateQuantity: (productId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    set((state) => ({
      selectedProducts: state.selectedProducts.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      ),
    }));
  },

  getTotalAmount: () => {
    const { selectedProducts } = get();
    const quantities = selectedProducts.reduce(
      (acc, product) => ({ ...acc, [product.id]: product.quantity }),
      {} as Record<string, number>
    );
    return calculateSaleTotals(selectedProducts, quantities).totalAmount;
  },

  completeSale: () => {
    const state = get();
    // Get real user ID from auth store
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) {
      ToastService.show("error", "Not Authenticated", "Please log in again");
      return;
    }

    try {
      const totalAmount = state.getTotalAmount();
      const quantities = state.selectedProducts.reduce(
        (acc, product) => ({ ...acc, [product.id]: product.quantity }),
        {} as Record<string, number>
      );

      const { totalProfit } = calculateSaleTotals(
        state.selectedProducts,
        quantities
      );

      // Generate a proper UUID for the sale
      const saleId = Crypto.randomUUID();

      // Prepare sale data
      const saleData = {
        id: saleId,
        user_id: userId,
        total_amount: totalAmount,
        payment_method: "cash",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Prepare sale items
      const saleItems = state.selectedProducts.map((product) => ({
        sale_id: saleId,
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.inventory?.sell_price || 0,
        total_price: (product.inventory?.sell_price || 0) * product.quantity,
      }));

      // Prepare inventory updates
      const inventoryUpdates = state.selectedProducts.map((product) => ({
        product_id: product.id,
        user_id: userId,
        stock: (product.inventory?.stock || 0) - product.quantity,
        buy_price: product.inventory?.buy_price || 0,
        sell_price: product.inventory?.sell_price || 0,
        is_active: true,
        updated_at: new Date().toISOString(),
      }));

      // Record sale in metrics store
      const { useMetricsStore } = require("../stores/metricsStore");
      const { recordSale } = useMetricsStore.getState();
      recordSale(totalAmount, totalProfit);

      // Record transaction in TinyBase store
      const { db } = require("../services/tinybaseStore");
      const transactionId = db.addTransaction({
        total_amount: totalAmount,
        payment_method: "cash",
        status: "completed",
        created_at: new Date().toISOString(),
      });

      // Record transaction items
      db.addTransactionItems(transactionId, saleItems);

      // Update local state immediately (works offline!)
      const { useProductStore } = require("../stores/productStore");
      const {
        setInventory,
        updateProductStock,
        inventory: currentInventory,
      } = useProductStore.getState();

      // Update local inventory state by merging with existing inventory
      const updatedInventory = [...(currentInventory || [])];

      inventoryUpdates.forEach((update) => {
        const existingIndex = updatedInventory.findIndex(
          (item) =>
            item.product_id === update.product_id &&
            item.user_id === update.user_id
        );

        const inventoryItem = {
          product_id: update.product_id,
          user_id: update.user_id,
          stock: update.stock,
          buy_price: update.buy_price,
          sell_price: update.sell_price,
          is_active: update.is_active,
          updated_at: update.updated_at,
        };

        if (existingIndex >= 0) {
          updatedInventory[existingIndex] = inventoryItem;
        } else {
          updatedInventory.push(inventoryItem);
        }
      });

      // Update local inventory in productStore
      setInventory(updatedInventory);

      // Update local product stock for immediate UI refresh
      state.selectedProducts.forEach((product) => {
        const newStock = (product.inventory?.stock || 0) - product.quantity;
        updateProductStock(product.id, newStock);
      });

      // Clear cart immediately (optimistic update)
      set({
        selectedProducts: [],
        selectedProductForQuantity: null,
        keypadInput: "",
      });

      // Show success message
      ToastService.sale.complete(totalAmount, state.selectedProducts.length);

      // Note: The actual sync will be handled by the component using the mutations
      // This keeps the store pure and lets the UI handle the sync logic
    } catch (error) {
      ToastService.show("error", "Sale Error", "Failed to complete sale");
    }
  },

  clearCart: () =>
    set({
      selectedProducts: [],
      selectedProductForQuantity: null,
      keypadInput: "",
    }),

  // Event Handlers (moved from App.tsx)
  handleProductPress: (product: ProductWithInventory) => {
    set((state) => {
      // If the same product is tapped again, deselect it
      if (state.selectedProductForQuantity?.id === product.id) {
        return { selectedProductForQuantity: null, keypadInput: "" };
      }
      // Otherwise, select the new product
      return { selectedProductForQuantity: product, keypadInput: "" };
    });
  },

  handleKeypadNumber: (num: string) => {
    set((state) => ({ keypadInput: state.keypadInput + num }));
  },

  handleKeypadDelete: () => {
    set((state) => ({ keypadInput: state.keypadInput.slice(0, -1) }));
  },

  handleKeypadClear: () => {
    set({ keypadInput: "" });
  },

  handleKeypadEnter: () => {
    const state = get();
    if (state.keypadInput && state.selectedProductForQuantity) {
      const quantity = parseInt(state.keypadInput);
      if (quantity > 0) {
        state.addToCart(state.selectedProductForQuantity, quantity);
        set({ selectedProductForQuantity: null, keypadInput: "" });
      }
    }
  },
}));

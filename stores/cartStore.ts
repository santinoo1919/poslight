import { create } from "zustand";
import { store } from "../services/tinybaseStore";
import { calculateSaleTotals } from "../utils/productHelpers";
import { ToastService } from "../services/toastService";
import type { Product } from "../types/database";
import type { CartProduct } from "../types/components";

interface CartState {
  // State
  selectedProducts: CartProduct[];
  selectedProductForQuantity: Product | null;
  keypadInput: string;
  dailyRevenue: number;
  dailyProfit: number;

  // Actions
  setSelectedProductForQuantity: (product: Product | null) => void;
  setKeypadInput: (input: string | ((prev: string) => string)) => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  getTotalAmount: () => number;
  completeSale: () => void;
  clearCart: () => void;

  // Event Handlers (moved from App.tsx)
  handleProductPress: (product: Product) => void;
  handleKeypadNumber: (num: string) => void;
  handleKeypadDelete: () => void;
  handleKeypadClear: () => void;
  handleKeypadEnter: () => void;

  // Stock update function
  updateStockAfterSale: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial state
  selectedProducts: [],
  selectedProductForQuantity: null,
  keypadInput: "",
  dailyRevenue: 0,
  dailyProfit: 0,

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
    const currentStock =
      (store.getCell("products", product.id, "stock") as number) || 0;

    // Check if we have enough stock before adding to cart
    const existing = get().selectedProducts.find((p) => p.id === product.id);
    const currentCartQuantity = existing ? existing.quantity : 0;
    const totalRequested = currentCartQuantity + quantity;

    if (totalRequested > currentStock) {
      ToastService.stock.insufficient(
        product.name,
        totalRequested,
        currentStock
      );
      return; // Don't add to cart if insufficient stock
    }

    // Low stock warning
    if (currentStock <= 10 && currentStock > 0) {
      ToastService.stock.lowStock(product.name, currentStock);
    }

    set((state) => {
      const existing = state.selectedProducts.find((p) => p.id === product.id);
      if (existing) {
        // FIXED: Replace quantity instead of adding to it
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

    if (state.selectedProducts.length === 0) {
      ToastService.show(
        "error",
        "Cart is Empty",
        "Please add products to cart"
      );
      return;
    }

    // Final stock validation before completing sale
    for (const product of state.selectedProducts) {
      const currentStock =
        (store.getCell("products", product.id, "stock") as number) || 0;
      if (product.quantity > currentStock) {
        ToastService.stock.insufficient(
          product.name,
          product.quantity,
          currentStock
        );
        return; // Don't complete sale if insufficient stock
      }
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

      // Store cart length before clearing
      const itemsSold = state.selectedProducts.length;

      // Update stock in TinyBase store before clearing cart
      state.selectedProducts.forEach((product) => {
        const currentStock = product.stock || 0;
        const newStock = Math.max(0, currentStock - product.quantity);

        // Update TinyBase store (for persistence)
        const { store } = require("../services/tinybaseStore");
        store.setCell("products", product.id, "stock", newStock);

        // Also update Zustand store for UI updates
        const { useProductStore } = require("../stores/productStore");
        const { updateProductStock } = useProductStore.getState();
        if (updateProductStock) {
          updateProductStock(product.id, newStock);
        }
      });

      // Update daily metrics
      set((state) => ({
        dailyRevenue: state.dailyRevenue + totalAmount,
        dailyProfit: state.dailyProfit + totalProfit,
        selectedProducts: [],
        selectedProductForQuantity: null,
        keypadInput: "",
      }));

      // Use the stored cart length for the toast
      ToastService.sale.complete(totalAmount, itemsSold);
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
  handleProductPress: (product: Product) => {
    set({ selectedProductForQuantity: product, keypadInput: "" });
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

  // Stock update function (unused - stock is updated in completeSale)
  updateStockAfterSale: () => {
    // This function is redundant as stock is already updated in completeSale
    // Keeping for potential future use
  },
}));

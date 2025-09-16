import { create } from "zustand";
import { calculateSaleTotals } from "../utils/productHelpers";
import { ToastService } from "../services/toastService";
import type { Product } from "../types/database";
import type { CartProduct } from "../types/components";
import type { ProductWithInventory } from "../types/components";

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

    if (totalRequested > product.inventory?.stock) {
      ToastService.stock.insufficient(
        product.name,
        totalRequested,
        product.inventory?.stock
      );
      return;
    }

    // Low stock warning
    if (product.inventory?.stock <= 10 && product.inventory?.stock > 0) {
      ToastService.stock.lowStock(product.name, product.inventory?.stock);
    }

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

    if (state.selectedProducts.length === 0) {
      ToastService.show(
        "error",
        "Cart is Empty",
        "Please add products to cart"
      );
      return;
    }

    // Final stock validation
    for (const product of state.selectedProducts) {
      if (product.quantity > product.inventory?.stock) {
        ToastService.stock.insufficient(
          product.name,
          product.quantity,
          product.inventory?.stock
        );
        return;
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

      // Update stock in TinyBase store
      const { store } = require("../services/tinybaseStore");
      state.selectedProducts.forEach((product) => {
        const newStock = Math.max(
          0,
          product.inventory?.stock - product.quantity
        );
        store.setCell("products", product.id, "stock", newStock);

        // Update Zustand store for UI updates
        const { useProductStore } = require("../stores/productStore");
        const { updateProductStock } = useProductStore.getState();
        if (updateProductStock) {
          updateProductStock(product.id, newStock);
        }
      });

      // Record sale in metrics store
      const { useMetricsStore } = require("../stores/metricsStore");
      const { recordSale } = useMetricsStore.getState();
      recordSale(totalAmount, totalProfit);

      // Clear cart on successful sale
      set({
        selectedProducts: [],
        selectedProductForQuantity: null,
        keypadInput: "",
      });

      // Show success message
      ToastService.sale.complete(totalAmount, state.selectedProducts.length);
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
}));

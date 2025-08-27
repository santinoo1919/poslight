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
    console.log("🛒 Zustand Store: addToCart called with:", {
      product: product.name,
      quantity,
      currentCartLength: get().selectedProducts.length,
    });

    const currentStock =
      (store.getCell("products", product.id, "stock") as number) || 0;

    // Low stock warning
    if (currentStock <= 10 && currentStock > 0) {
      ToastService.stock.lowStock(product.name, currentStock);
    }

    set((state) => {
      const existing = state.selectedProducts.find((p) => p.id === product.id);
      if (existing) {
        console.log("🛒 Zustand Store: Updating existing product quantity");
        const newState = {
          selectedProducts: state.selectedProducts.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
          ),
        };
        console.log("🛒 Zustand Store: New state after update:", newState);
        return newState;
      }
      console.log("🛒 Zustand Store: Adding new product to cart");
      const newState = {
        selectedProducts: [...state.selectedProducts, { ...product, quantity }],
      };
      console.log("🛒 Zustand Store: New state after add:", newState);
      return newState;
    });

    // Debug: Log the new state after a brief delay
    setTimeout(() => {
      console.log(
        "🛒 Zustand Store: Final cart state after set:",
        get().selectedProducts
      );
    }, 0);
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
    const state = get();
    const quantities = state.selectedProducts.reduce(
      (acc, product) => {
        acc[product.id] = product.quantity;
        return acc;
      },
      {} as Record<string, number>
    );

    const { totalAmount } = calculateSaleTotals(
      state.selectedProducts,
      quantities
    );
    return totalAmount;
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

    try {
      const totalAmount = state.getTotalAmount();
      const quantities = state.selectedProducts.reduce(
        (acc, product) => {
          acc[product.id] = product.quantity;
          return acc;
        },
        {} as Record<string, number>
      );

      const { totalProfit } = calculateSaleTotals(
        state.selectedProducts,
        quantities
      );

      // Store cart length before clearing
      const itemsSold = state.selectedProducts.length;

      // NOTE: Stock updates are now handled by the parent callback
      // to avoid duplicate updates. We don't update stock here anymore.

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
      console.error("❌ Error in completeSale:", error);
    }
  },

  clearCart: () =>
    set({
      selectedProducts: [],
      selectedProductForQuantity: null,
      keypadInput: "",
    }),
}));

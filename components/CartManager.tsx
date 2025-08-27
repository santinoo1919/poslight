import React from "react";
import type { CartManagerProps } from "../types/components";
import { useCartStore } from "../stores/cartStore";
import { store } from "../services/tinybaseStore";

export default function CartManager({
  children,
  onStockUpdate,
  onProductStockUpdate,
}: CartManagerProps) {
  // Get all state and actions from Zustand - this makes the component reactive
  const {
    selectedProducts,
    selectedProductForQuantity,
    keypadInput,
    dailyRevenue,
    dailyProfit,
    setSelectedProductForQuantity,
    setKeypadInput,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
    completeSale,
  } = useCartStore();

  // Enhanced completeSale that calls parent callbacks
  const handleCompleteSale = () => {
    completeSale();

    // Call parent callbacks for stock updates
    if (onProductStockUpdate) {
      selectedProducts.forEach((product) => {
        const currentStock =
          (store.getCell("products", product.id, "stock") as number) || 0;
        const newStock = Math.max(0, currentStock - product.quantity);
        onProductStockUpdate(product.id, newStock);
      });
    }
  };

  // Debug: Log when addToCart is called
  const handleAddToCart = (product: any, quantity: number) => {
    console.log("🛒 CartManager: addToCart called with:", {
      product: product.name,
      quantity,
    });
    addToCart(product, quantity);
  };

  // Debug: Log when setKeypadInput is called
  const handleSetKeypadInput = (input: string) => {
    console.log("⌨️ CartManager: setKeypadInput called with:", input);
    setKeypadInput(input);
  };

  return (
    <>
      {children({
        selectedProducts,
        selectedProductForQuantity,
        keypadInput,
        dailyRevenue,
        dailyProfit,
        addToCart: handleAddToCart, // Use our wrapped function
        removeFromCart,
        updateQuantity,
        setSelectedProductForQuantity,
        setKeypadInput: handleSetKeypadInput, // Use our wrapped function
        getTotalAmount,
        completeSale: handleCompleteSale,
      })}
    </>
  );
}

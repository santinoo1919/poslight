import React, { useState, useCallback } from "react";
import type {
  Product,
  CartProduct,
  CartManagerProps,
} from "../types/components";
import { store } from "../services/tinybaseStore";
import { calculateSaleTotals } from "../utils/productHelpers";
import { ToastService } from "../services/toastService";

export default function CartManager({
  children,
  onStockUpdate,
  onProductStockUpdate,
}: CartManagerProps) {
  // Cart state
  const [selectedProducts, setSelectedProducts] = useState<CartProduct[]>([]);
  const [selectedProductForQuantity, setSelectedProductForQuantity] =
    useState<Product | null>(null);
  const [keypadInput, setKeypadInput] = useState<string>("");

  // Daily metrics state
  const [dailyRevenue, setDailyRevenue] = useState<number>(0);
  const [dailyProfit, setDailyProfit] = useState<number>(0);

  // Cart operations with low stock warning
  const addToCart = useCallback((product: Product, quantity: number) => {
    // Check for low stock warning (but still allow adding to cart)
    const currentStock =
      (store.getCell("products", product.id, "stock") as number) || 0;
    if (currentStock <= 10 && currentStock > 0) {
      ToastService.stock.lowStock(product.name, currentStock);
    }

    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
    },
    [removeFromCart]
  );

  const getTotalAmount = useCallback((): number => {
    // Use our helper for clean calculation
    const quantities = selectedProducts.reduce(
      (acc, product) => {
        acc[product.id] = product.quantity;
        return acc;
      },
      {} as Record<string, number>
    );

    const { totalAmount } = calculateSaleTotals(selectedProducts, quantities);
    return totalAmount;
  }, [selectedProducts]);

  const completeSale = useCallback(() => {
    try {
      if (selectedProducts.length === 0) {
        ToastService.show(
          "error",
          "Cart is Empty",
          "Please add products to cart"
        );
        return;
      }

      // Calculate totals using our helper function
      const totalAmount = getTotalAmount();
      const quantities = selectedProducts.reduce(
        (acc, product) => {
          acc[product.id] = product.quantity;
          return acc;
        },
        {} as Record<string, number>
      );

      const { totalProfit } = calculateSaleTotals(selectedProducts, quantities);

      // Update stock levels for all sold products
      selectedProducts.forEach((product) => {
        const currentStock =
          (store.getCell("products", product.id, "stock") as number) || 0;
        const newStock = Math.max(0, currentStock - product.quantity);
        store.setCell("products", product.id, "stock", newStock);
        console.log(
          `📦 Updated stock for ${product.name}: ${currentStock} → ${newStock}`
        );

        // Use safer direct stock update if available
        if (onProductStockUpdate) {
          onProductStockUpdate(product.id, newStock);
        }
      });

      // Update daily metrics first
      setDailyRevenue((prev) => prev + totalAmount);
      setDailyProfit((prev) => prev + totalProfit);

      // Also update daily metrics in the store (synchronous)
      try {
        const { db } = require("../services/tinybaseStore");
        db.updateDailyMetrics(totalAmount, totalProfit);
      } catch (error) {
        console.error("Failed to update store daily metrics:", error);
      }

      // Clear cart
      setSelectedProducts([]);
      setSelectedProductForQuantity(null);
      setKeypadInput("");

      // Note: Stock updates are now handled directly via onProductStockUpdate
      // This is much safer than calling resetProducts which can cause crashes
      console.log("✅ Sale completed successfully - stock updated directly");

      // Success message
      ToastService.sale.complete(totalAmount, selectedProducts.length);
    } catch (error) {
      console.error("❌ Error in completeSale:", error);
      // Don't crash the app, just log the error
    }
  }, [selectedProducts, getTotalAmount, onStockUpdate]);

  return (
    <>
      {children({
        selectedProducts,
        selectedProductForQuantity,
        keypadInput,
        dailyRevenue,
        dailyProfit,
        addToCart,
        removeFromCart,
        updateQuantity,
        setSelectedProductForQuantity,
        setKeypadInput,
        getTotalAmount,
        completeSale,
      })}
    </>
  );
}

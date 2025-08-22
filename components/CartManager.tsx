import React, { useState, useCallback } from "react";
import type { Product } from "../types/database";
import { store } from "../services/tinybaseStore";
import { calculateSaleTotals } from "../utils/productHelpers";

interface CartProduct extends Product {
  quantity: number;
}

interface CartManagerProps {
  children: (props: {
    selectedProducts: CartProduct[];
    selectedProductForQuantity: Product | null;
    keypadInput: string;
    dailyRevenue: number;
    dailyProfit: number;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, newQuantity: number) => void;
    setSelectedProductForQuantity: (product: Product | null) => void;
    setKeypadInput: React.Dispatch<React.SetStateAction<string>>;
    getTotalAmount: () => number;
    completeSale: () => void;
  }) => React.ReactNode;
  onStockUpdate?: () => void; // Add callback to trigger refresh
  onProductStockUpdate?: (productId: string, newStock: number) => void; // Safer direct stock update
}

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

  // Cart operations
  const addToCart = useCallback((product: Product, quantity: number) => {
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
        // ToastService.order.cartEmpty();
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
      // ToastService.order.success(totalAmount);
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

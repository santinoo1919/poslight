import React, { useState, useCallback } from "react";
import type { Product } from "../types/database";

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
}

export default function CartManager({ children }: CartManagerProps) {
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
    return selectedProducts.reduce((total, product) => {
      const price = product.sellPrice || product.price || 0;
      return total + price * product.quantity;
    }, 0);
  }, [selectedProducts]);

  const completeSale = useCallback(() => {
    if (selectedProducts.length === 0) {
      // ToastService.order.cartEmpty();
      return;
    }

    // Calculate totals
    const totalAmount = getTotalAmount();
    const totalProfit = selectedProducts.reduce((profit, product) => {
      const buyPrice = product.buyPrice || 0;
      const sellPrice = product.sellPrice || product.price || 0;
      return profit + (sellPrice - buyPrice) * product.quantity;
    }, 0);

    // Update daily metrics
    setDailyRevenue((prev) => prev + totalAmount);
    setDailyProfit((prev) => prev + totalProfit);

    // Clear cart
    setSelectedProducts([]);
    setSelectedProductForQuantity(null);
    setKeypadInput("");

    // Success message
    // ToastService.order.success(totalAmount);
  }, [selectedProducts, getTotalAmount]);

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

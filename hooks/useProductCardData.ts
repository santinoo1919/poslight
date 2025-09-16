// hooks/useProductCardData.ts
import { useMemo } from "react";
import { Product, ProfitLevel } from "../types/database";
import { Inventory } from "../types/components";

export const useProductCardData = (product: Product, inventory?: Inventory) => {
  return useMemo(() => {
    // Use inventory data only (products no longer have business data)
    const stock = inventory?.stock ?? 0;
    const isLowStock = stock <= 10;
    const isOutOfStock = stock === 0;

    const buyPrice =
      inventory?.buy_price ?? (product.price ? product.price * 0.6 : 0);
    const sellPrice = inventory?.sell_price ?? product.price ?? 0;
    const profit = sellPrice - buyPrice;

    const profitLevel: ProfitLevel =
      profit >= 10 ? "high" : profit >= 3 ? "medium" : "low";

    return {
      stock,
      isLowStock,
      isOutOfStock,
      buyPrice,
      sellPrice,
      profit,
      profitLevel,
    };
  }, [product, inventory]);
};

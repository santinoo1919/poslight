// hooks/useProductCardData.ts
import { useMemo } from "react";
import { Product, ProfitLevel } from "../types/database";

export const useProductCardData = (product: Product) => {
  return useMemo(() => {
    const stock = product.stock || 0;
    const isLowStock = stock <= 10;
    const isOutOfStock = stock === 0;

    const buyPrice =
      product.buy_price || (product.price ? product.price * 0.6 : 0);
    const sellPrice = product.sell_price || product.price || 0;
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
  }, [product]);
};

import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "../stores/themeStore";
import type { ProductCardProps } from "../types/components";
import { getProfitTextColor } from "../utils/profitLevels";
import { calculateProductProfit } from "../utils/productHelpers";
import type { ProfitLevel } from "../types/database";

export default function ProductCard({
  product,
  onPress,
  isSelected = false,
}: ProductCardProps & { isSelected?: boolean }) {
  // Use stock from product prop (simpler and more reliable)
  const stock = product.stock || 0;
  const isLowStock = stock <= 10;
  const isOutOfStock = stock === 0;

  // Calculate actual profit amount and use it for color coding
  const buyPrice = product.buyPrice || 0;
  const sellPrice = product.sellPrice || product.price || 0;
  const actualProfit = sellPrice - buyPrice;

  // Use profit amount instead of percentage for more meaningful colors
  let profitLevel: ProfitLevel = "medium"; // default
  if (actualProfit >= 10)
    profitLevel = "high"; // €10+ profit = Green
  else if (actualProfit >= 3)
    profitLevel = "medium"; // €3-9 profit = Amber
  else profitLevel = "low"; // <€3 profit = Red

  return (
    <TouchableOpacity
      className={`rounded-lg border p-3 flex-1 ${
        isOutOfStock
          ? "bg-interactive-disabled dark:bg-interactive-disabledDark border-border-muted dark:border-border-dark opacity-50"
          : isSelected
            ? "bg-interactive-selected dark:bg-interactive-selectedDark border-brand-primary dark:border-brand-primaryDark"
            : "bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark"
      }`}
      onPress={isOutOfStock ? undefined : () => onPress?.(product)}
      activeOpacity={isOutOfStock ? 1 : Platform.OS === "ios" ? 0.7 : 1}
      disabled={isOutOfStock}
    >
      {/* Category Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: product.color || "#3B82F6" }}
        >
          <Text className="text-white text-xs font-medium">
            {product.icon || "📦"}
          </Text>
        </View>
        <Text className="text-xs text-text-muted dark:text-text-secondary">
          #{product.id}
        </Text>
      </View>

      {/* Product Image Placeholder */}
      <View className="h-16 bg-background-light dark:bg-background-dark rounded-md mb-2 items-center justify-center">
        <Text className="text-text-secondary dark:text-text-muted text-xl">
          📦
        </Text>
      </View>

      {/* Product Name */}
      <Text
        className={`font-semibold text-sm mb-1 ${
          isOutOfStock
            ? "text-text-secondary dark:text-text-muted"
            : "text-text-primary dark:text-text-inverse"
        }`}
        numberOfLines={2}
      >
        {product.name}
      </Text>

      {/* Price Layout */}
      <View className="mb-1 space-y-1">
        {/* Top row: Sell Price + Profit */}
        <View className="flex-row justify-between items-center">
          <Text
            className={`font-bold text-base ${
              isOutOfStock
                ? "text-gray-500 dark:text-gray-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            €{(product.sellPrice || product.price || 0).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-gray-500 dark:text-gray-400"
                : getProfitTextColor(profitLevel)
            }`}
          >
            +€
            {(() => {
              // Calculate profit with proper fallbacks
              let calculatedProfit = 0;

              if (product.profit !== undefined && !isNaN(product.profit)) {
                calculatedProfit = product.profit;
              } else if (
                product.sellPrice &&
                product.buyPrice &&
                !isNaN(product.sellPrice) &&
                !isNaN(product.buyPrice)
              ) {
                calculatedProfit = calculateProductProfit(
                  product.buyPrice || 0,
                  product.sellPrice || product.price || 0
                );
              } else if (
                product.profit !== undefined &&
                !isNaN(product.profit)
              ) {
                calculatedProfit = product.profit;
              } else if (product.price && !isNaN(product.price)) {
                calculatedProfit = product.price * 0.4; // 40% profit margin for old data
              }

              // Ensure we return a valid number
              return isNaN(calculatedProfit) ? 0 : calculatedProfit;
            })().toFixed(2)}
          </Text>
        </View>

        {/* Bottom row: Buy Price + Stock */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            €
            {(
              product.buyPrice || (product.price ? product.price * 0.6 : 0)
            ).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-red-500 dark:text-red-400"
                : isLowStock
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {isLowStock && !isOutOfStock && "⚠️ "}Stock: {stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

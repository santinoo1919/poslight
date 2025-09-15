import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import type { ProductCardProps } from "../types/components";
import { getProfitTextColor } from "../utils/profitLevels";
import { useProductCardData } from "../hooks/useProductCardData";

export default function ProductCard({
  product,
  inventory,
  onPress,
  isSelected = false,
}: ProductCardProps & { isSelected?: boolean }) {
  const {
    stock,
    isLowStock,
    isOutOfStock,
    buyPrice,
    sellPrice,
    profit,
    profitLevel,
  } = useProductCardData(product, inventory);

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
          #{product.sku}
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
                ? "text-text-secondary dark:text-text-muted"
                : "text-state-success dark:text-state-successDark"
            }`}
          >
            €{sellPrice.toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-text-secondary dark:text-text-muted"
                : getProfitTextColor(profitLevel)
            }`}
          >
            +€{profit.toFixed(2)}
          </Text>
        </View>

        {/* Bottom row: Buy Price + Stock */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-text-secondary dark:text-text-muted">
            €{buyPrice.toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-state-error dark:text-state-errorDark"
                : isLowStock
                  ? "text-state-error dark:text-state-errorDark"
                  : "text-text-secondary dark:text-text-muted"
            }`}
          >
            {isLowStock && !isOutOfStock && "⚠️ "}Stock: {stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

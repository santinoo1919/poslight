import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import type { ProductCardProps } from "../types/components";
import { getProfitTextColor } from "../utils/profitLevels";
import { calculateProductProfit } from "../utils/productHelpers";

export default function ProductCard({
  product,
  onPress,
  isSelected = false,
}: ProductCardProps & { isSelected?: boolean }) {
  // Use stock from product prop (simpler and more reliable)
  const stock = product.stock || 0;
  const isLowStock = stock <= 10;
  const isOutOfStock = stock === 0;

  return (
    <TouchableOpacity
      className={`rounded-lg border p-3 flex-1 ${
        isOutOfStock
          ? "bg-gray-100 border-gray-300 opacity-50"
          : isSelected
            ? "bg-blue-50 border-blue-300"
            : "bg-white border-gray-200"
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
        <Text className="text-xs text-gray-400">#{product.id}</Text>
      </View>

      {/* Product Image Placeholder */}
      <View className="h-16 bg-gray-100 rounded-md mb-2 items-center justify-center">
        <Text className="text-gray-500 text-xl">📦</Text>
      </View>

      {/* Product Name */}
      <Text
        className={`font-semibold text-sm mb-1 ${
          isOutOfStock ? "text-gray-500" : "text-gray-800"
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
              isOutOfStock ? "text-gray-500" : "text-green-600"
            }`}
          >
            €{(product.sellPrice || product.price || 0).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-gray-400"
                : getProfitTextColor(product.profitLevel || "medium")
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
          <Text
            className={`text-xs ${
              isOutOfStock ? "text-gray-400" : "text-gray-600"
            }`}
          >
            €
            {(
              product.buyPrice || (product.price ? product.price * 0.6 : 0)
            ).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isOutOfStock
                ? "text-red-500"
                : isLowStock
                  ? "text-red-600"
                  : "text-gray-500"
            }`}
          >
            {isLowStock && !isOutOfStock && "⚠️ "}Stock: {stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

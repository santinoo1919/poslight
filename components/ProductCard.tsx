import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import type { ProductCardProps } from "../types/components";
import { getProfitTextColor } from "../utils/profitLevels";

export default function ProductCard({
  product,
  onPress,
  isSelected = false,
}: ProductCardProps & { isSelected?: boolean }) {
  // Use stock from product prop (simpler and more reliable)
  const stock = product.stock || 0;
  const isLowStock = stock <= 10;

  return (
    <TouchableOpacity
      className={`rounded-lg border p-3 flex-1 ${
        isSelected ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
      }`}
      onPress={() => onPress?.(product)}
      activeOpacity={Platform.OS === "ios" ? 0.7 : 1}
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
        className="font-semibold text-gray-800 text-sm mb-1"
        numberOfLines={2}
      >
        {product.name}
      </Text>

      {/* Price Layout */}
      <View className="mb-1 space-y-1">
        {/* Top row: Sell Price + Profit */}
        <View className="flex-row justify-between items-center">
          <Text className="text-green-600 font-bold text-base">
            €{(product.sellPrice || product.price || 0).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${getProfitTextColor(product.profitLevel || "medium")}`}
          >
            +€
            {(() => {
              // Calculate profit with proper fallbacks
              if (product.profit !== undefined) return product.profit;
              if (product.sellPrice && product.buyPrice) return product.sellPrice - product.buyPrice;
              if (product.price) return product.price * 0.4; // 40% profit margin for old data
              return 0;
            })().toFixed(2)}
          </Text>
        </View>

        {/* Bottom row: Buy Price + Stock */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-600">
            €{(product.buyPrice || (product.price ? product.price * 0.6 : 0)).toFixed(2)}
          </Text>
          <Text
            className={`text-xs font-medium ${
              isLowStock ? "text-red-600" : "text-gray-500"
            }`}
          >
            Stock: {stock}
          </Text>
        </View>
      </View>

      {/* Low Stock Warning */}
      {isLowStock && (
        <Text className="text-xs text-red-500 mt-1">⚠️ Low Stock</Text>
      )}
    </TouchableOpacity>
  );
}

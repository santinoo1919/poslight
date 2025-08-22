import React from "react";
import { View, Text } from "react-native";

interface ProductGridHeaderProps {
  visibleProductsCount: number;
  totalProductsCount: number;
  currentCategory: string | null;
}

export default function ProductGridHeader({
  visibleProductsCount,
  totalProductsCount,
  currentCategory,
}: ProductGridHeaderProps) {
  return (
    <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-gray-800">
          Products ({visibleProductsCount})
        </Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-sm text-gray-500">
            {visibleProductsCount} items
          </Text>
          {currentCategory && (
            <Text className="text-xs text-gray-400">• {currentCategory}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

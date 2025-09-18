import React from "react";
import { View, Text } from "react-native";
import type { ProductGridHeaderProps } from "../types/components";

export default function ProductGridHeader({
  visibleProductsCount,
  totalProductsCount,
  currentCategory,
}: ProductGridHeaderProps) {
  // Determine the title based on whether a category is selected
  const title = currentCategory || "All Products";

  return (
    <View className="px-4 py-3 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
          {title} ({visibleProductsCount})
        </Text>
        <View className="flex-row items-center space-x-2">
          <Text className="text-sm text-text-secondary dark:text-text-muted">
            {visibleProductsCount} items
          </Text>
          {currentCategory && (
            <Text className="text-xs text-text-muted dark:text-text-secondary">
              • {currentCategory}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";
import SearchBar from "./SearchBar";
import type { ProductGridHeaderProps } from "../types/components";

export default function ProductGridHeader({
  visibleProductsCount,
  totalProductsCount,
  currentCategory,
  onSearch,
}: ProductGridHeaderProps) {
  // Determine the title based on whether a category is selected
  const title = currentCategory || "All Products";

  return (
    <View className="px-4 py-3 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
      <View className="flex-row justify-between items-center">
        <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
          {title} ({visibleProductsCount})
        </Text>
        <View className="flex-row items-center">
          {onSearch && (
            <View className="flex-shrink-0">
              <SearchBar onSearch={onSearch} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

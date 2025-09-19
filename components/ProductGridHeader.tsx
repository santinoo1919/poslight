import React from "react";
import { View, Text } from "react-native";
import SearchBar from "./SearchBar";
import type { ProductGridHeaderProps } from "../types/components";
import { useTheme } from "../stores/themeStore";

export default function ProductGridHeader({
  visibleProductsCount,
  totalProductsCount,
  currentCategory,
  onSearch,
}: ProductGridHeaderProps) {
  const { isDark } = useTheme();
  // Determine the title based on whether a category is selected
  const title = currentCategory || "All Products";

  return (
    <View
      className={`px-4 py-3 border-b ${isDark ? "border-border-dark bg-background-dark" : "border-border-light bg-background-light"}`}
    >
      <View className="flex-row justify-between items-center">
        <Text
          className={`text-lg font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"}`}
        >
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

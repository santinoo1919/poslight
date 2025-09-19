import React from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar from "../SearchBar";
import ProductGrid from "../ProductGrid";
import CategorySelector from "../AnimatedCategorySelector";
import type { Product } from "../../types/components";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";
import { useMetricsStore } from "../../stores/metricsStore";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useTheme } from "../../stores/themeStore";

export default function LeftPanel() {
  const { isDark } = useTheme();

  // Get product state from Zustand store
  const {
    products,
    loading,
    error,
    currentCategory,
    searchResults,
    isFiltering,
    handleCategorySelect,
    handleSearch,
  } = useProductStore();

  const { data: categories, isLoading: categoriesLoading } =
    useCategoriesQuery();

  // Get cart state from Zustand store
  const { selectedProductForQuantity } = useCartStore();

  return (
    <>
      {/* Categories - Full width scrollable */}
      <View
        className={`px-4 py-3 border-b ${isDark ? "border-border-dark" : "border-border-light"}`}
      >
        <CategorySelector
          categories={categories || []}
          currentCategory={currentCategory}
          onCategorySelect={handleCategorySelect}
        />
      </View>

      {/* Product Grid */}
      <View className="flex-1">
        <ProductGrid />
      </View>
    </>
  );
}

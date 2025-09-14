import React from "react";
import { View, Text, ScrollView } from "react-native";
import SearchBar from "../SearchBar";
import ProductGrid from "../ProductGrid";
import AnimatedCategorySelector from "../AnimatedCategorySelector";
import type { Product } from "../../types/components";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";
import { useMetricsStore } from "../../stores/metricsStore";

export default function LeftPanel() {
  // Get product state from Zustand store
  const {
    products,
    categories,
    loading,
    error,
    currentCategory,
    searchResults,
    isFiltering,
    handleCategorySelect,
    handleSearch,
  } = useProductStore();

  // Get cart state from Zustand store
  const { selectedProductForQuantity } = useCartStore();

  return (
    <>
      {/* Categories */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-sm font-medium text-slate-500 mb-2">
          Categories
        </Text>
        <View className="flex-row items-center justify-between">
          {/* Animated Category Selector */}
          <AnimatedCategorySelector
            categories={categories || []}
            currentCategory={currentCategory}
            onCategorySelect={handleCategorySelect}
          />

          {/* Search Bar - On the right, using remaining space */}
          <View className="ml-4 flex-shrink-0">
            <SearchBar onSearch={handleSearch} />
          </View>
        </View>
      </View>

      {/* Product Grid */}
      <View className="flex-1">
        <ProductGrid />
      </View>
    </>
  );
}

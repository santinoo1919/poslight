import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SearchBar from "../SearchBar";
import ProductGrid from "../ProductGrid";
import type { Product } from "../../types/components";
import { useProductStore } from "../../stores/productStore";
import { useCartStore } from "../../stores/cartStore";

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
  const { selectedProductForQuantity, dailyRevenue, dailyProfit } =
    useCartStore();

  return (
    <>
      {/* Categories */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Categories
        </Text>
        <View className="flex-row items-center justify-between">
          {/* Categories on the left */}
          <View className="flex-row flex-wrap items-center flex-1">
            {/* Show All option */}
            <TouchableOpacity
              className={`mr-2 px-3 py-2 rounded-full border ${
                currentCategory === null
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200 bg-white"
              }`}
              onPress={() => handleCategorySelect("Show All")}
            >
              <Text
                className={`text-xs font-medium ${
                  currentCategory === null ? "text-blue-600" : "text-gray-600"
                }`}
              >
                📦 Show All
              </Text>
            </TouchableOpacity>

            {!categories ||
            !Array.isArray(categories) ||
            categories.length === 0 ? (
              <View className="mr-2 px-3 py-2 rounded-full border border-gray-200 bg-gray-100">
                <Text className="text-xs text-gray-500">
                  Loading categories...
                </Text>
              </View>
            ) : (
              categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  className={`mr-2 px-3 py-2 rounded-full border ${
                    currentCategory === category.name
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => handleCategorySelect(category.name)}
                >
                  <Text
                    className={`text-xs ${
                      currentCategory === category.name
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {category.icon} {category.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>

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

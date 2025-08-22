import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import SearchBar from "../SearchBar";
import ProductGrid from "../ProductGrid";
import type { Product, Category } from "../../types/database";

interface LeftPanelProps {
  title: string;
  products: Product[];
  allProducts: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
  searchResults: Product[];
  isFiltering: boolean;
  onProductPress: (product: Product) => void;
  onCategorySelect: (categoryName: string) => void;
  onSearch: (query: string) => void;
  onRefresh: () => void;
  selectedProductForQuantity: Product | null;
  dailyRevenue: number;
  dailyProfit: number;
}

export default function LeftPanel({
  title,
  products,
  allProducts,
  categories,
  loading,
  error,
  currentCategory,
  searchResults,
  isFiltering,
  onProductPress,
  onCategorySelect,
  onSearch,
  onRefresh,
  selectedProductForQuantity,
  dailyRevenue,
  dailyProfit,
}: LeftPanelProps) {
  return (
    <>
      {/* Header with Daily Metrics on Right */}
      <View className="bg-gray-50 border-b border-gray-200 p-4">
        <View className="flex-row justify-between items-start mb-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-800">{title}</Text>

          {/* Daily Metrics - Initial UI Style */}
          <View className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg px-3 py-2">
            <View className="flex-row items-center space-x-3">
              <View className="items-center">
                <Text className="text-xs text-gray-600">Today's Revenue</Text>
                <Text className="text-sm font-bold text-green-600">
                  €{dailyRevenue.toFixed(2)}
                </Text>
              </View>
              <View className="w-px h-8 bg-gray-300"></View>
              <View className="items-center">
                <Text className="text-xs text-gray-600">Today's Profit</Text>
                <Text className="text-sm font-bold text-blue-600">
                  €{dailyProfit.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories and Search - Same Row */}
        <View className="flex-row items-center space-x-3 mb-3">
          {/* Categories - Smaller Size */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-1 flex-row space-x-2"
          >
            <TouchableOpacity
              onPress={() => onCategorySelect("Show All")}
              className={`px-3 py-1.5 rounded-full border ${
                !currentCategory
                  ? "bg-blue-600 border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Text
                className={`font-medium text-xs ${
                  !currentCategory ? "text-white" : "text-gray-700"
                }`}
              >
                Show All
              </Text>
            </TouchableOpacity>

            {categories?.map((category) => (
              <TouchableOpacity
                key={category.name}
                onPress={() => onCategorySelect(category.name)}
                className={`px-3 py-1.5 rounded-full border ${
                  currentCategory === category.name
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Text
                  className={`font-medium text-xs ${
                    currentCategory === category.name
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {category.icon} {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search Bar - Right Side */}
          <View className="w-48">
            <SearchBar onSearch={onSearch} />
          </View>
        </View>
      </View>

      {/* Product Grid */}
      <View className="flex-1">
        <ProductGrid
          onProductPress={onProductPress}
          products={products}
          allProducts={allProducts}
          loading={loading}
          error={error}
          onRefresh={onRefresh}
          selectedProductForQuantity={selectedProductForQuantity}
          isFiltering={isFiltering}
          currentCategory={currentCategory}
          searchResults={searchResults}
        />
      </View>
    </>
  );
}

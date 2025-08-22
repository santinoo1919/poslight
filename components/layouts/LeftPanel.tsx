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
}: LeftPanelProps) {
  return (
    <>
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">{title}</Text>

        {/* Search and Categories */}
        <View className="space-y-3">
          <SearchBar onSearch={onSearch} />

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-2"
          >
            <TouchableOpacity
              onPress={() => onCategorySelect("Show All")}
              className={`px-4 py-2 rounded-full border ${
                !currentCategory
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-medium ${
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
                className={`px-4 py-2 rounded-full border ${
                  currentCategory === category.name
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
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

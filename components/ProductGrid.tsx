import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import ProductCard from "./ProductCard";
import ProductGridSkeleton from "./ProductGridSkeleton";
import QuickAccessSection from "./QuickAccessSection";
import type { ProductGridProps } from "../types/components";
import type { Product } from "../types/database";

// Memoized ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = React.memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these critical props actually changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.sellPrice === nextProps.product.sellPrice &&
    prevProps.product.buyPrice === nextProps.product.buyPrice
  );
});

export default function ProductGrid({
  onProductPress,
  products,
  allProducts, // Add allProducts prop for QuickAccessSection
  loading,
  error,
  onRefresh,
  selectedProductForQuantity, // New prop for highlighting selected product
  isFiltering = false,
  currentCategory = null, // Add current category prop
  searchResults = [], // Add search results prop instead of searchQuery
}: ProductGridProps & {
  allProducts: Product[];
  selectedProductForQuantity?: Product | null;
  isFiltering?: boolean;
  currentCategory?: string | null;
  searchResults?: Product[];
}) {
  // SIMPLE: Use search results or filter by category
  const visibleProducts = React.useMemo(() => {
    // If searching, use search results
    if (searchResults.length > 0) {
      return searchResults;
    }

    // If not searching, apply category filter
    if (currentCategory) {
      const categoryKey = currentCategory.toLowerCase();
      return products.filter((product) => product.category === categoryKey);
    }

    // No search, no category = show all products
    return products;
  }, [products, currentCategory, searchResults]);

  // Show skeleton during loading, filtering, or when no products are loaded yet
  if (loading || isFiltering || products.length === 0) {
    return <ProductGridSkeleton />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-red-500 text-lg mb-2">
          Error loading products
        </Text>
        <Text className="text-gray-400 text-sm mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-md"
          onPress={onRefresh}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get most bought products (for now, just take first 4 with good stock)
  const mostBoughtProducts = visibleProducts
    .filter((product) => product.stock > 50) // Good stock availability
    .slice(0, 4);

  return (
    <View className="flex-1">
      {/* Products Header with Count */}
      <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-gray-800">
            Products ({visibleProducts.length})
          </Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-sm text-gray-500">
              {visibleProducts.length} items
            </Text>
          </View>
        </View>
      </View>

      {/* Product Grid - Scrollable */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <View className="space-y-6">
            {/* Dynamic Quick Access Section - Always shows all products */}
            <QuickAccessSection
              products={allProducts}
              onProductPress={onProductPress}
              selectedProductForQuantity={selectedProductForQuantity}
            />

            {/* All Products Grid - 4 columns */}
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-3">
                {currentCategory
                  ? `${currentCategory} Products`
                  : "All Products"}{" "}
                ({products.length - mostBoughtProducts.length})
              </Text>
              <View className="flex-row flex-wrap justify-start">
                {visibleProducts
                  .filter(
                    (item) =>
                      !mostBoughtProducts.some((mb) => mb.id === item.id)
                  )
                  .map((item) => (
                    <View key={item.id} className="w-1/4 p-1">
                      <MemoizedProductCard
                        product={item}
                        onPress={onProductPress}
                        isSelected={selectedProductForQuantity?.id === item.id}
                      />
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

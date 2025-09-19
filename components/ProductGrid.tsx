import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductGridHeader from "./ProductGridHeader";
import ErrorDisplay from "./ErrorDisplay";
import ProductCard from "./ProductCard";
import type { Product } from "../types/database";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useInventoryQuery } from "../hooks/useInventoryQuery";
import { useTheme } from "../stores/themeStore";
import { getGridColumns, getProductCardSpacing } from "../utils/responsive";

// Memoized ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = React.memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.inventory === nextProps.inventory
  );
});

export default function ProductGrid() {
  const { isDark } = useTheme();
  const columns = getGridColumns();
  const cardSpacing = getProductCardSpacing();

  // Get product state from Zustand store
  const {
    products,
    loading,
    error,
    currentCategory,
    searchResults,
    resetProducts,
    inventory: localInventory,
    handleSearch,
  } = useProductStore();

  // Get cart state from Zustand store
  const { selectedProductForQuantity, handleProductPress } = useCartStore();

  // Get current user for inventory query
  const { user } = useAuthStore();

  // Fetch inventory data (for initial load and sync)
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventoryQuery(user?.id || "");

  // Use local inventory if available, otherwise use query data
  const inventoryToUse =
    localInventory && localInventory.length > 0
      ? localInventory
      : inventoryData;

  // Create inventory lookup map
  const inventoryMap = useMemo(() => {
    if (!inventoryToUse) return new Map();

    const map = new Map();
    inventoryToUse.forEach((inventory) => {
      map.set(inventory.product_id, inventory);
    });
    return map;
  }, [inventoryToUse]);

  // Memoize visible products - only recompute when dependencies change
  const visibleProducts = useMemo(() => {
    if (loading || !products) return [];

    // If searching, use search results
    if (searchResults.length > 0) {
      return searchResults;
    }

    // If category selected, filter by category key
    if (currentCategory) {
      return products.filter((product) => product.category === currentCategory);
    }

    // No search, no category = show all products
    return products;
  }, [loading, products, searchResults, currentCategory]);

  // Show skeleton only during actual loading states
  if ((loading || !products) && !localInventory?.length) {
    return <ProductGridSkeleton />;
  }

  // Show error if there is one
  if (error) {
    return <ErrorDisplay error={error} onRetry={resetProducts} />;
  }

  return (
    <View
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      <ProductGridHeader
        visibleProductsCount={visibleProducts.length}
        totalProductsCount={products?.length || 0}
        currentCategory={currentCategory}
        onSearch={handleSearch}
      />

      <ScrollView
        className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
        showsVerticalScrollIndicator={false}
      >
        <View
          className={`p-4 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
        >
          <View className="space-y-6">
            {/* Main Products Grid - Dynamic columns */}
            <View>
              <View className="flex-row flex-wrap justify-start">
                {visibleProducts.map((product, index) => {
                  const inventory = inventoryMap?.get(product.id);
                  const columnWidth =
                    columns === 2
                      ? "w-1/2"
                      : columns === 3
                        ? "w-1/3"
                        : columns === 4
                          ? "w-1/4"
                          : "w-1/5";
                  return (
                    <View
                      key={product.id || `product-${index}`}
                      className={`${columnWidth} ${cardSpacing}`}
                    >
                      <MemoizedProductCard
                        product={product}
                        inventory={inventory}
                        onPress={handleProductPress}
                        isSelected={
                          selectedProductForQuantity?.id === product.id
                        }
                      />
                    </View>
                  );
                })}
              </View>

              {/* Show message if no products */}
              {visibleProducts.length === 0 && (
                <View className="py-8 items-center">
                  <Text
                    className={`${isDark ? "text-text-muted" : "text-text-secondary"} text-center text-sm`}
                  >
                    {currentCategory
                      ? `No products found in ${currentCategory}`
                      : "No products available"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

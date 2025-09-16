import React, { useMemo } from "react";
import { View } from "react-native";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductGridHeader from "./ProductGridHeader";
import ProductGridContent from "./ProductGridContent";
import ErrorDisplay from "./ErrorDisplay";
import type { Product } from "../types/database";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";
import { useAuthStore } from "../stores/authStore";
import { useInventoryQuery } from "../hooks/useInventoryQuery";

export default function ProductGrid() {
  // Get product state from Zustand store
  const {
    products,
    loading,
    error,
    currentCategory,
    searchResults,
    resetProducts,
    inventory: localInventory,
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
  // Don't show skeleton if we have local inventory data
  if ((loading || !products) && !localInventory?.length) {
    return <ProductGridSkeleton />;
  }

  // Show error if there is one
  if (error) {
    return <ErrorDisplay error={error} onRetry={resetProducts} />;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <ProductGridHeader
        visibleProductsCount={visibleProducts.length}
        totalProductsCount={products?.length || 0}
        currentCategory={currentCategory}
      />

      <ProductGridContent
        products={visibleProducts}
        allProducts={products || []}
        inventoryMap={inventoryMap}
        onProductPress={handleProductPress}
        selectedProductForQuantity={selectedProductForQuantity}
        currentCategory={currentCategory}
        loading={loading || inventoryLoading}
      />
    </View>
  );
}

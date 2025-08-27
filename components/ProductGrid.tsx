import React from "react";
import { View } from "react-native";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductGridHeader from "./ProductGridHeader";
import ProductGridContent from "./ProductGridContent";
import ErrorDisplay from "./ErrorDisplay";
import type { Product } from "../types/database";
import { useProductStore } from "../stores/productStore";
import { useCartStore } from "../stores/cartStore";

export default function ProductGrid() {
  // Get product state from Zustand store
  const {
    products,
    loading,
    error,
    isFiltering,
    currentCategory,
    searchResults,
    getVisibleProducts,
    resetProducts,
  } = useProductStore();

  // Get cart state from Zustand store
  const { selectedProductForQuantity, handleProductPress } = useCartStore();

  // Get computed visible products
  const visibleProducts = getVisibleProducts();

  // Show skeleton only during actual loading states, not when products are filtered out
  if (loading || isFiltering || !products) {
    console.log("🔍 Showing skeleton:", {
      loading,
      isFiltering,
      productsLength: products?.length || 0,
    });
    return <ProductGridSkeleton />;
  }

  // Show error if there is one
  if (error) {
    console.log("🔍 Showing error:", error);
    return <ErrorDisplay error={error} onRetry={resetProducts} />;
  }

  // Show products
  console.log("🔍 Rendering products:", {
    visible: visibleProducts.length,
    total: products?.length || 0,
  });

  return (
    <View className="flex-1 bg-gray-50">
      <ProductGridHeader
        visibleProductsCount={visibleProducts.length}
        totalProductsCount={products?.length || 0}
        currentCategory={currentCategory}
      />

      <ProductGridContent
        products={visibleProducts}
        allProducts={products || []}
        onProductPress={handleProductPress}
        selectedProductForQuantity={selectedProductForQuantity}
        currentCategory={currentCategory}
        loading={loading}
      />
    </View>
  );
}

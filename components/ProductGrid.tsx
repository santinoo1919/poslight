import React from "react";
import { View } from "react-native";
import ProductGridSkeleton from "./ProductGridSkeleton";
import ProductGridHeader from "./ProductGridHeader";
import ProductGridContent from "./ProductGridContent";
import ErrorDisplay from "./ErrorDisplay";
import type { ProductGridProps } from "../types/components";
import type { Product } from "../types/database";
import { useDataSafety } from "../hooks/useDataSafety";

export default function ProductGrid({
  onProductPress,
  products,
  allProducts,
  loading,
  error,
  onRefresh,
  selectedProductForQuantity,
  isFiltering = false,
  currentCategory = null,
  searchResults = [],
}: ProductGridProps & {
  allProducts: Product[];
  selectedProductForQuantity?: Product | null;
  isFiltering?: boolean;
  currentCategory?: string | null;
  searchResults?: Product[];
}) {
  // 🔒 DATA SAFETY: Validate data before processing
  const { isDataSafeForRendering, validateProductsWithZod } = useDataSafety();

  // Debug logging for troubleshooting
  console.log("🔍 ProductGrid Debug:", {
    productsLength: products?.length || 0,
    allProductsLength: allProducts?.length || 0,
    loading,
    error,
    isFiltering,
    currentCategory,
    searchResultsLength: searchResults?.length || 0,
  });

  // 🔒 DATA SAFETY: Check if data is safe for rendering with Zod
  if (!loading && products) {
    const validationResult = validateProductsWithZod(products);
    if (!validationResult.success) {
      console.error(
        "❌ ProductGrid: Zod validation failed:",
        validationResult.error.issues.slice(0, 3)
      );
      return (
        <ErrorDisplay
          error={`Data validation failed: ${validationResult.error.issues[0]?.message || "Unknown error"}`}
          onRetry={onRefresh}
        />
      );
    }
  }

  // SIMPLE: Use search results or filter by category
  const visibleProducts = React.useMemo(() => {
    // If searching, use search results
    if (searchResults.length > 0) {
      console.log("🔍 Using search results:", searchResults.length);
      return searchResults;
    }

    // If not searching, apply category filter
    if (currentCategory) {
      const categoryKey = currentCategory.toLowerCase();
      const filtered = products.filter(
        (product) => product.category === categoryKey
      );
      console.log("🔍 Category filter applied:", {
        category: currentCategory,
        filtered: filtered.length,
      });
      return filtered;
    }

    // No search, no category = show all products
    console.log("🔍 Showing all products:", products.length);
    return products;
  }, [products, currentCategory, searchResults]);

  // Show skeleton during loading, filtering, or when no products are loaded yet
  if (loading || isFiltering || !products || products.length === 0) {
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
    return <ErrorDisplay error={error} onRetry={onRefresh} />;
  }

  // Show products
  console.log("🔍 Rendering products:", {
    visible: visibleProducts.length,
    total: products.length,
  });

  return (
    <View className="flex-1 bg-gray-100">
      <ProductGridHeader
        visibleProductsCount={visibleProducts.length}
        totalProductsCount={products.length}
        currentCategory={currentCategory}
      />

      <ProductGridContent
        products={visibleProducts}
        allProducts={allProducts}
        onProductPress={onProductPress}
        selectedProductForQuantity={selectedProductForQuantity}
        currentCategory={currentCategory}
      />
    </View>
  );
}

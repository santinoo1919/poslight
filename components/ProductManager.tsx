import React, { useState, useMemo, useCallback } from "react";
import type { Product, Category } from "../types/database";
import type { ProductManagerProps } from "../types/components";
import useTinyBase from "../hooks/useTinyBase";
import useSearch from "../hooks/useSearch";
import {
  filterProductsByCategory,
  searchProductsByName,
} from "../utils/productHelpers";

export default function ProductManager({ children }: ProductManagerProps) {
  const {
    searchProducts,
    products,
    categories,
    loading,
    error,
    resetProducts,
    updateProductStock,
  } = useTinyBase();

  // DEBUG: Check what products we're getting
  console.log("🔍 ProductManager - products from hook:", products);
  console.log("🔍 ProductManager - products.length:", products?.length || 0);
  console.log("🔍 ProductManager - loading:", loading);

  // Product state
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Search logic
  const {
    searchQuery,
    searchResults,
    handleSearch: searchHookHandleSearch,
    clearSearch,
    isSearching,
  } = useSearch(products);

  // Memoized search handler using our helper
  const handleSearch = useCallback(
    (query: string) => {
      // Use our helper for clean search
      const results = searchProductsByName(products, query);
      searchHookHandleSearch(query);
    },
    [searchHookHandleSearch, products]
  );

  // Category selection
  const handleCategorySelect = useCallback((categoryName: string) => {
    if (categoryName === "Show All") {
      setCurrentCategory(null);
      return;
    }
    setCurrentCategory(categoryName);
  }, []);

  // Visible products logic - simplified using our helper
  const visibleProducts = useMemo(() => {
    // If searching, use search results
    if (searchResults.length > 0) {
      return searchResults;
    }

    // If not searching, apply category filter using our helper
    if (currentCategory) {
      return filterProductsByCategory(products, currentCategory);
    }

    // No search, no category = show all products
    return products;
  }, [products, currentCategory, searchResults]);

  return (
    <>
      {children({
        products,
        categories,
        loading,
        error,
        currentCategory,
        searchResults,
        isFiltering,
        visibleProducts,
        handleCategorySelect,
        handleSearch,
        clearSearch,
        isSearching,
        resetProducts,
        updateProductStock,
      })}
    </>
  );
}

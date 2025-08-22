import React, { useState, useMemo, useCallback } from "react";
import type { Product, Category } from "../types/database";
import useTinyBase from "../hooks/useTinyBase";
import useSearch from "../hooks/useSearch";

interface ProductManagerProps {
  children: (props: {
    products: Product[];
    categories: Category[];
    loading: boolean;
    error: string | null;
    currentCategory: string | null;
    searchResults: Product[];
    isFiltering: boolean;
    visibleProducts: Product[];
    handleCategorySelect: (categoryName: string) => void;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
    isSearching: boolean;
    resetProducts: () => void;
  }) => React.ReactNode;
}

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

  // Memoized search handler
  const handleSearch = useCallback(
    (query: string) => {
      searchHookHandleSearch(query);
    },
    [searchHookHandleSearch]
  );

  // Category selection
  const handleCategorySelect = useCallback((categoryName: string) => {
    if (categoryName === "Show All") {
      setCurrentCategory(null);
      return;
    }
    setCurrentCategory(categoryName);
  }, []);

  // Visible products logic
  const visibleProducts = useMemo(() => {
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
      })}
    </>
  );
}

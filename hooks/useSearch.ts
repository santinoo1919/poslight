import { useState, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import type { Product } from "../types/database";

export default function useSearch(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // FAST: Memoized Fuse instance
  const fuseSearch = useMemo(() => {
    if (products.length === 0) return null;

    return new Fuse(products, {
      keys: [
        { name: "name", weight: 2 }, // Product name is most important
        { name: "categoryName", weight: 1 }, // Category is secondary
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      shouldSort: true,
    });
  }, [products]); // Recreate when products change (needed for accuracy)

  // FAST: Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim() || !fuseSearch) {
        setSearchResults([]);
        return;
      }

      const results = fuseSearch.search(query);
      setSearchResults(results.map((result) => result.item));
    }, 100), // 100ms for responsive feel
    [fuseSearch]
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // SIMPLE: Always use debouncing for consistent behavior
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    handleSearch,
    clearSearch,
    isSearching: searchQuery.trim().length > 0,
  };
}

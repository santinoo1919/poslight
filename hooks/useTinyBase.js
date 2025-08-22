import { useState, useEffect, useCallback, useMemo } from "react";
import { store, initializeStore } from "../services/tinybaseStore";
import Fuse from "fuse.js";
import { debounce } from "lodash";
import { calculateProfitLevel } from "../utils/profitLevels";

export default function useTinyBase() {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize store and load data
  useEffect(() => {
    const initStore = async () => {
      try {
        setLoading(true);

        // Initialize store with persistence
        await initializeStore();

        // Get data from store using the proper db.getProducts() function
        const productsData = store.getTable("products");
        const categoriesData = store.getTable("categories");

        // Simple approach: Use whatever data is in the store
        if (productsData && Object.keys(productsData).length > 0) {
          console.log("✅ Data found in store, loading...");

          // Set loading to false
          setLoading(false);

          // Use the proper db.getProducts() function to get products with IDs
          const { db } = await import("../services/tinybaseStore");
          const processedProducts = db.getProducts();

          // 🔒 DATA SAFETY: Validate data structure before using
          const { ensureDataIntegrity } = await import(
            "../utils/dataValidation"
          );
          if (!ensureDataIntegrity(processedProducts, "products")) {
            console.error(
              "❌ Data validation failed - regenerating fresh data"
            );
            // Force regenerate data if validation fails
            await initializeStore();
            const freshProducts = db.getProducts();
            if (ensureDataIntegrity(freshProducts, "products")) {
              setProducts(freshProducts);
            } else {
              throw new Error(
                "Failed to generate valid data after validation failure"
              );
            }
          } else {
            setProducts(processedProducts);
          }

          console.log("Products loaded:", processedProducts.length, "items");

          // Categories are already in correct format
          if (categoriesData && Object.keys(categoriesData).length > 0) {
            const categoriesArray = Object.entries(categoriesData).map(
              ([key, category]) => ({
                key,
                ...category,
              })
            );
            console.log("Categories loaded:", categoriesArray);
            setCategories(categoriesArray);
          }
        } else {
          // No data yet, keep loading
          console.log("⏳ Waiting for data to be generated...");
        }
      } catch (err) {
        console.error("Failed to initialize store:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    initStore();
  }, []);

  // Initialize Fuse.js search engine for lightning-fast search
  const fuseSearch = useMemo(() => {
    if (products.length === 0) return null;

    return new Fuse(products, {
      keys: [
        { name: "name", weight: 2 }, // Product name is most important
        { name: "categoryName", weight: 1 }, // Category is secondary
        { name: "barcode", weight: 0.5 }, // Barcode is least important
      ],
      threshold: 0.3, // How fuzzy the search should be
      includeScore: true, // Include relevance scores
      minMatchCharLength: 2, // Minimum characters to start searching
      shouldSort: true, // Sort by relevance
    });
  }, [products]);

  // Lightning-fast search with Fuse.js (fuzzy, instant results)
  const searchProducts = useCallback(
    (query) => {
      if (!query.trim()) {
        return products; // Return all products instead of setting state
      }

      if (!fuseSearch) {
        return products; // Return all products instead of setting state
      }

      // Super fast fuzzy search with Fuse.js
      const searchResults = fuseSearch.search(query);

      // Extract just the items from Fuse results
      const filteredItems = searchResults.map((result) => result.item);

      return filteredItems; // Return results instead of setting state
    },
    [products, fuseSearch]
  );

  // Debounced search for smooth typing experience
  const debouncedSearch = useMemo(
    () => debounce(searchProducts, 300),
    [searchProducts]
  );

  // SIMPLE: Category filtering (no state management)
  const getProductsByCategory = useCallback(
    (category) => {
      if (!category || category === "all") {
        return products; // Return all products
      }

      // Return filtered products
      return products.filter((product) => product.category === category);
    },
    [products]
  );

  // SIMPLE: Reset products (no state management)
  const resetProducts = useCallback(() => {
    // Just refresh from store
    try {
      setLoading(true);

      const productsData = store.getTable("products");
      const categoriesData = store.getTable("categories");

      if (productsData && Object.keys(productsData).length > 0) {
        const processedProducts = Object.values(productsData).map(
          (product) => ({
            ...product,
            categoryName:
              categoriesData[product.category]?.name || product.category,
            color: categoriesData[product.category]?.color || "#3B82F6",
            icon: categoriesData[product.category]?.icon || "📦",
            // Pre-calculate profit and profit level
            profit: product.sellPrice - product.buyPrice,
            profitLevel: calculateProfitLevel(
              product.buyPrice,
              product.sellPrice
            ),
          })
        );
        setProducts(processedProducts);
      }

      if (categoriesData && Object.keys(categoriesData).length > 0) {
        const categoriesArray = Object.entries(categoriesData).map(
          ([key, category]) => ({
            key,
            ...category,
          })
        );
        setCategories(categoriesArray);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to refresh products:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // SIMPLE: Just update the main products array
  const updateProductStock = useCallback((productId, newStock) => {
    console.log(`🔍 updateProductStock: ${productId} -> ${newStock}`);

    // Update main products array
    setProducts((prevProducts) => {
      return prevProducts.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      );
    });
  }, []);

  // Get total inventory value (instant)
  const getInventoryValue = useCallback(() => {
    return products.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);
  }, [products]);

  return {
    // Data
    products,

    categories,
    loading,
    error,

    // Operations
    searchProducts,
    debouncedSearch,
    getProductsByCategory,
    resetProducts,
    getInventoryValue,
    updateProductStock,

    // Store access
    store,
  };
}

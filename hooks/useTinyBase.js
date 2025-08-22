import { useState, useEffect, useCallback, useMemo } from "react";
import { store, initializeStore } from "../services/tinybaseStore";
import {
  enrichProductsWithCategories,
  enrichProductWithProfit,
  updateProductStock as updateProductStockHelper,
  filterProductsByCategory,
} from "../utils/productHelpers";

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

  // Search functionality is now handled by useSearch hook
  // This keeps useTinyBase focused on data management only

  // SIMPLE: Category filtering using our helper
  const getProductsByCategory = useCallback(
    (category) => {
      if (!category || category === "all") {
        return products; // Return all products
      }

      // Use our helper for clean filtering
      return filterProductsByCategory(products, category);
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
        // Use our clean helper functions instead of complex inline logic
        const enrichedProducts = enrichProductsWithCategories(
          productsData,
          categoriesData
        ).map((product) => enrichProductWithProfit(product));
        setProducts(enrichedProducts);
      }

      if (categoriesData && Object.keys(categoriesData).length > 0) {
        // Use our helper for categories
        const categoriesArray = Object.entries(categoriesData).map(
          ([key, category]) => ({ key, ...category })
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

  // SIMPLE: Just update the main products array using our helper
  const updateProductStock = useCallback((productId, newStock) => {
    console.log(`🔍 updateProductStock: ${productId} -> ${newStock}`);

    // Use our clean helper function
    setProducts((prevProducts) =>
      updateProductStockHelper(prevProducts, productId, newStock)
    );
  }, []);

  // Get total inventory value (instant)
  const getInventoryValue = useCallback(() => {
    return products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  }, [products]);

  return {
    // Data
    products,
    categories,
    loading,
    error,

    // Operations
    getProductsByCategory,
    resetProducts,
    getInventoryValue,
    updateProductStock,

    // Store access
    store,
  };
}

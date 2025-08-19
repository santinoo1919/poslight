import { useState, useEffect, useCallback } from "react";
import { store, db } from "../services/tinybaseStore";

export default function useTinyBase() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize store and load data
  useEffect(() => {
    try {
      setLoading(true);

      // Load data immediately (synchronous)
      const productsData = db.getProducts();
      const categoriesData = db.getCategories();

      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);

      setLoading(false);
    } catch (err) {
      console.error("Failed to initialize store:", err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Super fast search (in-memory, instant results)
  const searchProducts = useCallback(
    (query) => {
      if (!query.trim()) {
        setFilteredProducts(products);
        return;
      }

      // Instant search - no async needed!
      const queryLower = query.toLowerCase();
      const searchResults = products.filter(
        (product) =>
          product.name.toLowerCase().includes(queryLower) ||
          product.category.toLowerCase().includes(queryLower) ||
          (product.barcode && product.barcode.includes(query))
      );
      setFilteredProducts(searchResults);
    },
    [products]
  );

  // Super fast category filtering
  const getProductsByCategory = useCallback(
    (category) => {
      if (!category || category === "all") {
        // Show all products
        setFilteredProducts(products);
        return;
      }

      // Instant filtering - no async needed!
      const categoryProducts = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(categoryProducts);
    },
    [products]
  );

  // Reset to show all products
  const resetProducts = useCallback(() => {
    setFilteredProducts(products);
  }, [products]);

  // Instant stock update
  const updateStock = useCallback(
    (productId, newStock) => {
      try {
        // Update TinyBase store
        db.updateStock(productId, newStock);

        // Update local state
        const updatedProducts = products.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        return true;
      } catch (err) {
        console.error("Failed to update stock:", err);
        return false;
      }
    },
    [products]
  );

  // Refresh products
  const refreshProducts = useCallback(() => {
    try {
      setLoading(true);

      const productsData = db.getProducts();
      const categoriesData = db.getCategories();

      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);

      setLoading(false);
    } catch (err) {
      console.error("Failed to refresh products:", err);
      setError(err.message);
      setLoading(false);
    }
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
    filteredProducts,
    categories,
    loading,
    error,

    // Operations
    searchProducts,
    getProductsByCategory,
    resetProducts,
    updateStock,
    refreshProducts,
    getInventoryValue,

    // Store access
    store,
  };
}

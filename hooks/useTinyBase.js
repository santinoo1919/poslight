import { useState, useEffect, useCallback, useMemo } from "react";
import { store, db } from "../services/tinybaseStore";
import Fuse from "fuse.js";
import { debounce } from "lodash";

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

  // Update product stock in UI
  const updateProductStock = useCallback((productId, newStock) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
    setFilteredProducts((prevFiltered) =>
      prevFiltered.map((p) =>
        p.id === productId ? { ...p, stock: newStock } : p
      )
    );
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
    debouncedSearch,
    getProductsByCategory,
    resetProducts,
    updateStock,
    refreshProducts,
    getInventoryValue,
    updateProductStock,

    // Store access
    store,
  };
}

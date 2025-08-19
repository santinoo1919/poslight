import { useState, useEffect, useCallback } from "react";
import database from "../services/database";

export default function useLocalProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await database.getProducts();
      const categoriesData = await database.getCategories();

      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(
    async (query) => {
      if (!query.trim()) {
        setFilteredProducts(products);
        return;
      }

      try {
        const searchResults = await database.searchProducts(query);
        setFilteredProducts(searchResults);
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback to local search
        const localResults = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            (product.barcode && product.barcode.includes(query))
        );
        setFilteredProducts(localResults);
      }
    },
    [products]
  );

  // Get products by category
  const getProductsByCategory = useCallback(
    async (category) => {
      try {
        const categoryProducts = await database.getProductsByCategory(category);
        setFilteredProducts(categoryProducts);
      } catch (err) {
        console.error("Failed to get products by category:", err);
        // Fallback to local filtering
        const localResults = products.filter(
          (product) => product.category === category
        );
        setFilteredProducts(localResults);
      }
    },
    [products]
  );

  // Update stock
  const updateStock = useCallback(
    async (productId, newStock) => {
      try {
        const success = await database.updateStock(productId, newStock);
        if (success) {
          // Refresh products to get updated stock
          await fetchProducts();
        }
        return success;
      } catch (err) {
        console.error("Failed to update stock:", err);
        return false;
      }
    },
    [fetchProducts]
  );

  // Refresh products
  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    filteredProducts,
    categories,
    loading,
    error,
    searchProducts,
    getProductsByCategory,
    updateStock,
    refreshProducts,
  };
}

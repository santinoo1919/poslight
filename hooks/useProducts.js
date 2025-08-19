import { useState, useEffect, useCallback } from "react";
import medusaApi from "../services/medusaApi";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Fetch all products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check connection first
      const connected = await medusaApi.checkConnection();
      setIsOnline(connected);

      if (connected) {
        const productsData = await medusaApi.getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } else {
        // Fallback to mock data when offline
        setProducts(getMockProducts());
        setFilteredProducts(getMockProducts());
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
      // Fallback to mock data on error
      setProducts(getMockProducts());
      setFilteredProducts(getMockProducts());
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
        if (isOnline) {
          // Use Medusa search when online
          const searchResults = await medusaApi.searchProducts(query);
          setFilteredProducts(searchResults);
        } else {
          // Local search when offline
          const localResults = products.filter(
            (product) =>
              product.name.toLowerCase().includes(query.toLowerCase()) ||
              product.category.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredProducts(localResults);
        }
      } catch (err) {
        console.error("Search failed:", err);
        // Fallback to local search
        const localResults = products.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(localResults);
      }
    },
    [products, isOnline]
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
    loading,
    error,
    isOnline,
    searchProducts,
    refreshProducts,
  };
}

// Mock data fallback
function getMockProducts() {
  return [
    { id: 1, name: "Coca Cola", price: 2.5, stock: 45, category: "Beverages" },
    { id: 2, name: "Chips", price: 1.99, stock: 23, category: "Snacks" },
    { id: 3, name: "Bread", price: 3.49, stock: 12, category: "Bakery" },
    { id: 4, name: "Milk", price: 4.99, stock: 8, category: "Dairy" },
    { id: 5, name: "Chocolate Bar", price: 1.49, stock: 67, category: "Candy" },
    {
      id: 6,
      name: "Water Bottle",
      price: 1.99,
      stock: 34,
      category: "Beverages",
    },
  ];
}

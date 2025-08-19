import { useState, useEffect, useCallback } from "react";

// Simple in-memory store that definitely works
const simpleStore = {
  categories: [
    { name: "Beverages", color: "#10B981", icon: "🥤" },
    { name: "Snacks", color: "#F59E0B", icon: "🍿" },
    { name: "Dairy", color: "#8B5CF6", icon: "🥛" },
    { name: "Bakery", color: "#EF4444", icon: "🥖" },
    { name: "Candy", color: "#EC4899", icon: "🍫" },
    { name: "Household", color: "#06B6D4", icon: "🧽" },
    { name: "Personal Care", color: "#84CC16", icon: "🧴" },
    { name: "Frozen", color: "#6366F1", icon: "🧊" },
  ],
  products: [
    // Beverages
    {
      id: "beverage-1",
      name: "Coca Cola 330ml",
      price: 2.5,
      stock: 45,
      category: "beverages",
      barcode: "5000112543211",
    },
    {
      id: "beverage-2",
      name: "Pepsi Max 330ml",
      price: 2.3,
      stock: 38,
      category: "beverages",
      barcode: "5000112543212",
    },
    {
      id: "beverage-3",
      name: "Fanta Orange 330ml",
      price: 2.2,
      stock: 42,
      category: "beverages",
      barcode: "5000112543213",
    },
    {
      id: "beverage-4",
      name: "Water Bottle 500ml",
      price: 1.99,
      stock: 67,
      category: "beverages",
      barcode: "5000112543214",
    },
    {
      id: "beverage-5",
      name: "Red Bull 250ml",
      price: 3.99,
      stock: 23,
      category: "beverages",
      barcode: "5000112543215",
    },

    // Snacks
    {
      id: "snack-1",
      name: "Lay's Classic Chips",
      price: 1.99,
      stock: 34,
      category: "snacks",
      barcode: "5000112543216",
    },
    {
      id: "snack-2",
      name: "Doritos Nacho Cheese",
      price: 2.49,
      stock: 28,
      category: "snacks",
      barcode: "5000112543217",
    },
    {
      id: "snack-3",
      name: "Pringles Original",
      price: 2.99,
      stock: 19,
      category: "snacks",
      barcode: "5000112543218",
    },
    {
      id: "snack-4",
      name: "Popcorn Sweet & Salty",
      price: 1.79,
      stock: 31,
      category: "snacks",
      barcode: "5000112543219",
    },
    {
      id: "snack-5",
      name: "Nuts Mixed 100g",
      price: 3.49,
      stock: 15,
      category: "snacks",
      barcode: "5000112543220",
    },

    // Dairy
    {
      id: "dairy-1",
      name: "Fresh Milk 1L",
      price: 4.99,
      stock: 12,
      category: "dairy",
      barcode: "5000112543221",
    },
    {
      id: "dairy-2",
      name: "Greek Yogurt 500g",
      price: 3.99,
      stock: 18,
      category: "dairy",
      barcode: "5000112543222",
    },
    {
      id: "dairy-3",
      name: "Cheddar Cheese 200g",
      price: 5.49,
      stock: 9,
      category: "dairy",
      barcode: "5000112543223",
    },
    {
      id: "dairy-4",
      name: "Butter 250g",
      price: 3.29,
      stock: 22,
      category: "dairy",
      barcode: "5000112543224",
    },
    {
      id: "dairy-5",
      name: "Cream 300ml",
      price: 2.79,
      stock: 16,
      category: "dairy",
      barcode: "5000112543225",
    },

    // Bakery
    {
      id: "bakery-1",
      name: "Fresh Bread Loaf",
      price: 3.49,
      stock: 8,
      category: "bakery",
      barcode: "5000112543226",
    },
    {
      id: "bakery-2",
      name: "Croissant",
      price: 2.99,
      stock: 14,
      category: "bakery",
      barcode: "5000112543227",
    },
    {
      id: "bakery-3",
      name: "Chocolate Muffin",
      price: 2.49,
      stock: 11,
      category: "bakery",
      barcode: "5000112543228",
    },
    {
      id: "bakery-4",
      name: "Donut Glazed",
      price: 1.99,
      stock: 19,
      category: "bakery",
      barcode: "5000112543229",
    },
    {
      id: "bakery-5",
      name: "Bagel Everything",
      price: 2.79,
      stock: 13,
      category: "bakery",
      barcode: "5000112543230",
    },

    // Candy
    {
      id: "candy-1",
      name: "Snickers Bar",
      price: 1.49,
      stock: 56,
      category: "candy",
      barcode: "5000112543231",
    },
    {
      id: "candy-2",
      name: "KitKat 4-Finger",
      price: 1.79,
      stock: 43,
      category: "candy",
      barcode: "5000112543232",
    },
    {
      id: "candy-3",
      name: "Twix Bar",
      price: 1.59,
      stock: 38,
      category: "candy",
      barcode: "5000112543233",
    },
    {
      id: "candy-4",
      name: "M&M's Chocolate",
      price: 2.19,
      stock: 29,
      category: "candy",
      barcode: "5000112543234",
    },
    {
      id: "candy-5",
      name: "Skittles 100g",
      price: 1.99,
      stock: 35,
      category: "candy",
      barcode: "5000112543235",
    },
  ],
};

export default function useSimpleStore() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize store immediately
  useEffect(() => {
    try {
      // Load data immediately
      const productsData = simpleStore.products.map((product) => {
        const category = simpleStore.categories.find(
          (c) => c.name.toLowerCase() === product.category
        );
        return {
          ...product,
          categoryName: category?.name || product.category,
          color: category?.color || "#3B82F6",
          icon: category?.icon || "📦",
        };
      });

      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(simpleStore.categories);
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
      // Instant filtering - no async needed!
      const categoryProducts = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(categoryProducts);
    },
    [products]
  );

  // Instant stock update
  const updateStock = useCallback(
    (productId, newStock) => {
      try {
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
    const productsData = simpleStore.products.map((product) => {
      const category = simpleStore.categories.find(
        (c) => c.name.toLowerCase() === product.category
      );
      return {
        ...product,
        categoryName: category?.name || product.category,
        color: category?.color || "#3B82F6",
        icon: category?.icon || "📦",
      };
    });
    setProducts(productsData);
    setFilteredProducts(productsData);
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
    updateStock,
    refreshProducts,
    getInventoryValue,

    // Store access
    store: simpleStore,
  };
}

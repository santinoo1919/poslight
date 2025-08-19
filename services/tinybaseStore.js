import { createStore } from "tinybase";

// Create the main store
export const store = createStore()
  .setTable("categories", {
    beverages: { name: "Beverages", color: "#10B981", icon: "🥤" },
    snacks: { name: "Snacks", color: "#F59E0B", icon: "🍿" },
    dairy: { name: "Dairy", color: "#8B5CF6", icon: "🥛" },
    bakery: { name: "Bakery", color: "#EF4444", icon: "🥖" },
    candy: { name: "Candy", color: "#EC4899", icon: "🍫" },
    household: { name: "Household", color: "#06B6D4", icon: "🧽" },
    "personal-care": { name: "Personal Care", color: "#84CC16", icon: "🧴" },
    frozen: { name: "Frozen", color: "#6366F1", icon: "🧊" },
  })
  .setTable("products", {
    // Beverages
    "beverage-1": {
      id: "beverage-1",
      name: "Coca Cola 330ml",
      price: 2.5,
      stock: 45,
      category: "beverages",
      barcode: "5000112543211",
      description: "Classic Coca Cola in 330ml can",
    },
    "beverage-2": {
      id: "beverage-2",
      name: "Pepsi Max 330ml",
      price: 2.3,
      stock: 38,
      category: "beverages",
      barcode: "5000112543212",
      description: "Sugar-free Pepsi Max",
    },
    "beverage-3": {
      id: "beverage-3",
      name: "Fanta Orange 330ml",
      price: 2.2,
      stock: 42,
      category: "beverages",
      barcode: "5000112543213",
      description: "Refreshing orange Fanta",
    },
    "beverage-4": {
      id: "beverage-4",
      name: "Water Bottle 500ml",
      price: 1.99,
      stock: 67,
      category: "beverages",
      barcode: "5000112543214",
      description: "Pure spring water",
    },
    "beverage-5": {
      id: "beverage-5",
      name: "Red Bull 250ml",
      price: 3.99,
      stock: 23,
      category: "beverages",
      barcode: "5000112543215",
      description: "Energy drink with taurine",
    },

    // Snacks
    "snack-1": {
      id: "snack-1",
      name: "Lay's Classic Chips",
      price: 1.99,
      stock: 34,
      category: "snacks",
      barcode: "5000112543216",
      description: "Classic potato chips",
    },
    "snack-2": {
      id: "snack-2",
      name: "Doritos Nacho Cheese",
      price: 2.49,
      stock: 28,
      category: "snacks",
      barcode: "5000112543217",
      description: "Cheesy nacho tortilla chips",
    },
    "snack-3": {
      id: "snack-3",
      name: "Pringles Original",
      price: 2.99,
      stock: 19,
      category: "snacks",
      barcode: "5000112543218",
      description: "Stackable potato crisps",
    },
    "snack-4": {
      id: "snack-4",
      name: "Popcorn Sweet & Salty",
      price: 1.79,
      stock: 31,
      category: "snacks",
      barcode: "5000112543219",
      description: "Perfect movie snack",
    },
    "snack-5": {
      id: "snack-5",
      name: "Nuts Mixed 100g",
      price: 3.49,
      stock: 15,
      category: "snacks",
      barcode: "5000112543220",
      description: "Premium mixed nuts",
    },

    // Dairy
    "dairy-1": {
      id: "dairy-1",
      name: "Fresh Milk 1L",
      price: 4.99,
      stock: 12,
      category: "dairy",
      barcode: "5000112543221",
      description: "Fresh whole milk",
    },
    "dairy-2": {
      id: "dairy-2",
      name: "Greek Yogurt 500g",
      price: 3.99,
      stock: 18,
      category: "dairy",
      barcode: "5000112543222",
      description: "Creamy Greek yogurt",
    },
    "dairy-3": {
      id: "dairy-3",
      name: "Cheddar Cheese 200g",
      price: 5.49,
      stock: 9,
      category: "dairy",
      barcode: "5000112543223",
      description: "Aged cheddar cheese",
    },
    "dairy-4": {
      id: "dairy-4",
      name: "Butter 250g",
      price: 3.29,
      stock: 22,
      category: "dairy",
      barcode: "5000112543224",
      description: "Pure butter",
    },
    "dairy-5": {
      id: "dairy-5",
      name: "Cream 300ml",
      price: 2.79,
      stock: 16,
      category: "dairy",
      barcode: "5000112543225",
      description: "Heavy whipping cream",
    },

    // Bakery
    "bakery-1": {
      id: "bakery-1",
      name: "Fresh Bread Loaf",
      price: 3.49,
      stock: 8,
      category: "bakery",
      barcode: "5000112543226",
      description: "Fresh baked bread",
    },
    "bakery-2": {
      id: "bakery-2",
      name: "Croissant",
      price: 2.99,
      stock: 14,
      category: "bakery",
      barcode: "5000112543227",
      description: "Buttery French croissant",
    },
    "bakery-3": {
      id: "bakery-3",
      name: "Chocolate Muffin",
      price: 2.49,
      stock: 11,
      category: "bakery",
      barcode: "5000112543228",
      description: "Chocolate chip muffin",
    },
    "bakery-4": {
      id: "bakery-4",
      name: "Donut Glazed",
      price: 1.99,
      stock: 19,
      category: "bakery",
      barcode: "5000112543229",
      description: "Glazed donut",
    },
    "bakery-5": {
      id: "bakery-5",
      name: "Bagel Everything",
      price: 2.79,
      stock: 13,
      category: "bakery",
      barcode: "5000112543230",
      description: "Everything bagel with toppings",
    },

    // Candy
    "candy-1": {
      id: "candy-1",
      name: "Snickers Bar",
      price: 1.49,
      stock: 56,
      category: "candy",
      barcode: "5000112543231",
      description: "Chocolate bar with caramel and nuts",
    },
    "candy-2": {
      id: "candy-2",
      name: "KitKat 4-Finger",
      price: 1.79,
      stock: 43,
      category: "candy",
      barcode: "5000112543232",
      description: "Crispy wafer chocolate bar",
    },
    "candy-3": {
      id: "candy-3",
      name: "Twix Bar",
      price: 1.59,
      stock: 38,
      category: "candy",
      barcode: "5000112543233",
      description: "Caramel and cookie chocolate bar",
    },
    "candy-4": {
      id: "candy-4",
      name: "M&M's Chocolate",
      price: 2.19,
      stock: 29,
      category: "candy",
      barcode: "5000112543234",
      description: "Colorful chocolate candies",
    },
    "candy-5": {
      id: "candy-5",
      name: "Skittles 100g",
      price: 1.99,
      stock: 35,
      category: "candy",
      barcode: "5000112543235",
      description: "Fruit-flavored chewy candies",
    },
  })
  .setTable("transactions", {})
  .setTable("transaction_items", {});

// For now, run without persistence to get the app working

// Database operations
export const db = {
  // Get all products with category info
  getProducts: () => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    return Object.values(products).map((product) => ({
      ...product,
      categoryName: categories[product.category]?.name || product.category,
      color: categories[product.category]?.color || "#3B82F6",
      icon: categories[product.category]?.icon || "📦",
    }));
  },

  // Get all categories
  getCategories: () => {
    return Object.values(store.getTable("categories"));
  },

  // Search products (super fast in-memory search)
  searchProducts: (query) => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");
    const queryLower = query.toLowerCase();

    return Object.values(products)
      .filter(
        (product) =>
          product.name.toLowerCase().includes(queryLower) ||
          product.category.toLowerCase().includes(queryLower) ||
          (product.barcode && product.barcode.includes(query))
      )
      .map((product) => ({
        ...product,
        categoryName: categories[product.category]?.name || product.category,
        color: categories[product.category]?.color || "#3B82F6",
        icon: categories[product.category]?.icon || "📦",
      }));
  },

  // Get products by category
  getProductsByCategory: (category) => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    return Object.values(products)
      .filter((product) => product.category === category)
      .map((product) => ({
        ...product,
        categoryName: categories[product.category]?.name || product.category,
        color: categories[product.category]?.color || "#3B82F6",
        icon: categories[product.category]?.icon || "📦",
      }));
  },

  // Update stock (instant update)
  updateStock: (productId, newStock) => {
    store.setCell("products", productId, "stock", newStock);
    return true;
  },

  // Add transaction
  addTransaction: (transaction) => {
    const transactionId = `txn-${Date.now()}`;
    store.setRow("transactions", transactionId, {
      id: transactionId,
      total_amount: transaction.total_amount,
      payment_method: transaction.payment_method || "cash",
      status: "completed",
      created_at: new Date().toISOString(),
    });
    return transactionId;
  },

  // Add transaction items
  addTransactionItems: (transactionId, items) => {
    items.forEach((item, index) => {
      const itemId = `${transactionId}-item-${index}`;
      store.setRow("transaction_items", itemId, {
        id: itemId,
        transaction_id: transactionId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      });
    });
  },
};

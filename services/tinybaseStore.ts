import { createStore } from "tinybase";
import { createLocalPersister } from "tinybase/persisters/persister-browser";
import type {
  Product,
  Category,
  Transaction,
  TransactionItem,
} from "../types/database";

// Generate bulk products following current FMCG structure
const generateBulkProducts = (): Record<string, Omit<Product, "id">> => {
  const baseCategories: Record<
    string,
    { name: string; color: string; icon: string }
  > = {
    beverages: { name: "Beverages", color: "#10B981", icon: "🥤" },
    snacks: { name: "Snacks", color: "#F59E0B", icon: "🍿" },
    dairy: { name: "Dairy", color: "#8B5CF6", icon: "🥛" },
    bakery: { name: "Bakery", color: "#EF4444", icon: "🥖" },
    candy: { name: "Candy", color: "#EC4899", icon: "🍫" },
    household: { name: "Household", color: "#06B6D4", icon: "🧽" },
    "personal-care": { name: "Personal Care", color: "#84CC16", icon: "🧴" },
    frozen: { name: "Frozen", color: "#6366F1", icon: "🧊" },
    electronics: { name: "Electronics", color: "#F97316", icon: "📱" },
    clothing: { name: "Clothing", color: "#8B5A2B", icon: "👕" },
    books: { name: "Books", color: "#059669", icon: "📚" },
    toys: { name: "Toys", color: "#DC2626", icon: "🧸" },
  };

  const products: Record<string, Omit<Product, "id">> = {};
  let productId = 1;

  // Generate products for each category
  Object.entries(baseCategories).forEach(([categoryKey, categoryInfo]) => {
    const categoryName = categoryInfo.name;

    // Generate 150-200 products per category for 2000 total
    const productsPerCategory = Math.floor(Math.random() * 50) + 150;

    for (let i = 1; i <= productsPerCategory; i++) {
      const productKey = `${categoryKey}-${productId}`;

      // Generate realistic product names based on category
      const productName = generateProductName(categoryName, i);

      // Generate realistic prices based on category
      const basePrice = getBasePriceForCategory(categoryName);
      const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const price = parseFloat((basePrice * (1 + priceVariation)).toFixed(2));

      // Generate realistic stock levels
      const stock = Math.floor(Math.random() * 200) + 10; // 10-210 units

      // Generate realistic barcodes
      const barcode = generateBarcode(productId);

      // Calculate buy price (cost) and sell price with profit margin
      const buyPrice = parseFloat((price * 0.6).toFixed(2)); // 40% profit margin
      const sellPrice = price;
      const margin = sellPrice - buyPrice;

      products[productKey] = {
        name: productName,
        buyPrice: buyPrice,
        sellPrice: sellPrice,
        margin: margin,
        stock: stock,
        category: categoryKey,
        barcode: barcode,
        description: `${productName} - High quality ${categoryName.toLowerCase()} product`,
        categoryName: categoryName,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
      };

      productId++;
    }
  });

  return products;
};

// Helper function to generate realistic product names
const generateProductName = (category: string, index: number): string => {
  const categoryNames: Record<string, string[]> = {
    Beverages: [
      "Cola",
      "Lemonade",
      "Orange Juice",
      "Apple Juice",
      "Grape Juice",
      "Energy Drink",
      "Sports Drink",
      "Tea",
      "Coffee",
      "Water",
      "Milk",
      "Smoothie",
      "Shake",
      "Hot Chocolate",
      "Iced Tea",
      "Fruit Punch",
    ],
    Snacks: [
      "Potato Chips",
      "Tortilla Chips",
      "Popcorn",
      "Nuts",
      "Pretzels",
      "Crackers",
      "Cookies",
      "Granola Bar",
      "Trail Mix",
      "Jerky",
      "Cheese Puffs",
      "Rice Cakes",
      "Veggie Chips",
      "Pita Chips",
    ],
    Dairy: [
      "Milk",
      "Yogurt",
      "Cheese",
      "Butter",
      "Cream",
      "Sour Cream",
      "Cottage Cheese",
      "Ice Cream",
      "Whipped Cream",
      "Half & Half",
    ],
    Bakery: [
      "Bread",
      "Croissant",
      "Muffin",
      "Donut",
      "Bagel",
      "Cookie",
      "Cake",
      "Pie",
      "Pastry",
      "Roll",
      "Bun",
      "Scone",
    ],
    Candy: [
      "Chocolate Bar",
      "Gummy Bears",
      "Hard Candy",
      "Caramel",
      "Toffee",
      "Lollipop",
      "Jelly Bean",
      "Licorice",
      "Mint",
      "Fudge",
    ],
    Household: [
      "Cleaning Spray",
      "Paper Towels",
      "Toilet Paper",
      "Dish Soap",
      "Laundry Detergent",
      "Trash Bags",
      "Air Freshener",
      "Batteries",
    ],
    "Personal Care": [
      "Shampoo",
      "Conditioner",
      "Soap",
      "Toothpaste",
      "Deodorant",
      "Lotion",
      "Sunscreen",
      "Razor",
      "Shaving Cream",
      "Hair Gel",
    ],
    Frozen: [
      "Frozen Pizza",
      "Ice Cream",
      "Frozen Vegetables",
      "Frozen Meals",
      "Frozen Fruit",
      "Frozen Fish",
      "Frozen Chicken",
      "Frozen Desserts",
    ],
    Electronics: [
      "Phone Charger",
      "Headphones",
      "USB Cable",
      "Power Bank",
      "Screen Protector",
      "Phone Case",
      "Bluetooth Speaker",
      "Wireless Earbuds",
      "Cable Adapter",
    ],
    Clothing: [
      "T-Shirt",
      "Jeans",
      "Hoodie",
      "Socks",
      "Underwear",
      "Jacket",
      "Sweater",
      "Pants",
      "Shorts",
      "Dress",
      "Skirt",
      "Hat",
    ],
    Books: [
      "Fiction Novel",
      "Non-Fiction Book",
      "Cookbook",
      "Self-Help Book",
      "Biography",
      "History Book",
      "Science Book",
      "Travel Guide",
    ],
    Toys: [
      "Action Figure",
      "Board Game",
      "Puzzle",
      "Building Blocks",
      "Doll",
      "Car Toy",
      "Plush Animal",
      "Art Supplies",
      "Educational Toy",
    ],
  };

  const names = categoryNames[category] || ["Product"];
  const nameIndex = (index - 1) % names.length;
  const baseName = names[nameIndex];

  // Add variety with sizes, flavors, brands
  const variations = [
    "Premium",
    "Classic",
    "Organic",
    "Natural",
    "Deluxe",
    "Basic",
  ];
  const variation = variations[Math.floor(Math.random() * variations.length)];

  return `${variation} ${baseName}`;
};

// Helper function to get base prices for categories
const getBasePriceForCategory = (category: string): number => {
  const basePrices: Record<string, number> = {
    Beverages: 2.5,
    Snacks: 3.0,
    Dairy: 4.5,
    Bakery: 3.5,
    Candy: 2.0,
    Household: 5.0,
    "Personal Care": 6.0,
    Frozen: 8.0,
    Electronics: 15.0,
    Clothing: 25.0,
    Books: 12.0,
    Toys: 20.0,
  };

  return basePrices[category] || 5.0;
};

// Helper function to generate realistic barcodes
const generateBarcode = (productId: number): string => {
  const prefix = "123456789";
  const paddedId = productId.toString().padStart(6, "0");
  return `${prefix}${paddedId}`;
};

// Create the main store with bulk products
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
    electronics: { name: "Electronics", color: "#F97316", icon: "📱" },
    clothing: { name: "Clothing", color: "#8B5A2B", icon: "👕" },
    books: { name: "Books", color: "#059669", icon: "📚" },
    toys: { name: "Toys", color: "#DC2626", icon: "🧸" },
  })
  .setTable("products", {}) // ← Start empty for true persistence!
  .setTable("transactions", {})
  .setTable("transaction_items", {});

// Create persister for localStorage
export const persister = createLocalPersister(store, "poslight-cache");

// Initialize store with data and persistence
export const initializeStore = async (): Promise<void> => {
  try {
    console.log("🚀 Starting fresh data generation...");

    // Always generate fresh, clean data
    const startTime = Date.now();
    const products = generateBulkProducts();
    const endTime = Date.now();

    console.log(
      `⏱️ Generated ${Object.keys(products).length} products in ${endTime - startTime}ms`
    );

    // Set fresh products
    store.setTable("products", products);

    // Categories are already set in store creation
    console.log("✅ Fresh data loaded into store");

    // Start persistence
    await persister.startAutoLoad();
    await persister.startAutoSave();
    console.log("💾 Persistence started");
  } catch (error) {
    console.error("Error initializing store:", error);
    // Fallback: generate in-memory data
    const products = generateBulkProducts();
    store.setTable("products", products);
    console.log("🔄 Fallback: Generated in-memory data");
  }
};

// For now, run without persistence to get the app working

// Database operations
export const db: {
  getProducts: () => Product[];
  getCategories: () => Category[];
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  updateStock: (productId: string, newStock: number) => boolean;
  addTransaction: (transaction: Omit<Transaction, "id">) => string;
  addTransactionItems: (
    transactionId: string,
    items: Omit<TransactionItem, "id">[]
  ) => void;
  getDailyMetrics: () => {
    revenue: number;
    profit: number;
    lastUpdated: string;
  };
  updateDailyMetrics: (revenue: number, profit: number) => void;
} = {
  // Get all products with category info
  getProducts: (): Product[] => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    return Object.entries(products).map(
      ([productId, product]) =>
        ({
          id: productId,
          ...product,
          categoryName:
            (categories[product.category as string] as any)?.name ||
            product.category,
          color:
            (categories[product.category as string] as any)?.color || "#3B82F6",
          icon: (categories[product.category as string] as any)?.icon || "📦",
        }) as Product
    );
  },

  // Get all categories
  getCategories: (): Category[] => {
    return Object.values(store.getTable("categories")) as unknown as Category[];
  },

  // Search products (super fast in-memory search)
  searchProducts: (query: string): Product[] => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");
    const queryLower = query.toLowerCase();

    return Object.entries(products)
      .filter(
        ([productId, product]) =>
          (product.name as string).toLowerCase().includes(queryLower) ||
          (product.category as string).toLowerCase().includes(queryLower) ||
          (product.barcode && (product.barcode as string).includes(query))
      )
      .map(
        ([productId, product]) =>
          ({
            id: productId,
            ...product,
            categoryName:
              (categories[product.category as string] as any)?.name ||
              product.category,
            color:
              (categories[product.category as string] as any)?.color ||
              "#3B82F6",
            icon: (categories[product.category as string] as any)?.icon || "📦",
          }) as Product
      );
  },

  // Get products by category
  getProductsByCategory: (category: string): Product[] => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    return Object.entries(products)
      .filter(([productId, product]) => product.category === category)
      .map(
        ([productId, product]) =>
          ({
            id: productId,
            ...product,
            categoryName:
              (categories[product.category as string] as any)?.name ||
              product.category,
            color:
              (categories[product.category as string] as any)?.color ||
              "#3B82F6",
            icon: (categories[product.category as string] as any)?.icon || "📦",
          }) as Product
      );
  },

  // Update stock (instant update)
  updateStock: (productId: string, newStock: number): boolean => {
    store.setCell("products", productId, "stock", newStock);
    return true;
  },

  // Add transaction
  addTransaction: (transaction: Omit<Transaction, "id">): string => {
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
  addTransactionItems: (
    transactionId: string,
    items: Omit<TransactionItem, "id">[]
  ): void => {
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

  // Get daily metrics
  getDailyMetrics: (): {
    revenue: number;
    profit: number;
    lastUpdated: string;
  } => {
    const metrics = store.getTable("dailyMetrics");
    const today = new Date().toDateString();

    // Check if we have today's metrics
    if (metrics[today]) {
      return {
        revenue: (metrics[today].revenue as number) || 0,
        profit: (metrics[today].profit as number) || 0,
        lastUpdated:
          (metrics[today].lastUpdated as string) || new Date().toISOString(),
      };
    }

    // Return default values for new day
    return {
      revenue: 0,
      profit: 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  // Update daily metrics
  updateDailyMetrics: (revenue: number, profit: number): void => {
    const today = new Date().toDateString();
    const currentMetrics = store.getTable("dailyMetrics")[today] || {
      revenue: 0,
      profit: 0,
    };

    store.setRow("dailyMetrics", today, {
      revenue: ((currentMetrics.revenue as number) || 0) + revenue,
      profit: ((currentMetrics.profit as number) || 0) + profit,
      lastUpdated: new Date().toISOString(),
    });
  },
};

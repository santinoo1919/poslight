import { createStore } from "tinybase";
import { getProfitLevel } from "../utils/profitLevels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  Product,
  Category,
  Transaction,
  TransactionItem,
} from "../types/database";
import * as Crypto from "expo-crypto";

// TinyBase store - persistent, populated by queries from Supabase

// Create the main store (empty, will be populated by queries)
export const store = createStore()
  .setTable("categories", {})
  .setTable("products", {})
  .setTable("inventory", {})
  .setTable("transactions", {})
  .setTable("transaction_items", {})
  .setTable("stock_updates", {}) // For stock update sync
  .setTable("sync_queue", {}) // For persistent sync operations
  .setTable("dailyMetrics", {}) // For daily metrics
  .setTable("cashflowMetrics", {}); // For cashflow metrics

// Persistence functions
const STORAGE_KEY = "tinybase_store";

export const saveStore = async () => {
  try {
    const storeData = {
      categories: store.getTable("categories"),
      products: store.getTable("products"),
      inventory: store.getTable("inventory"),
      transactions: store.getTable("transactions"),
      transaction_items: store.getTable("transaction_items"),
      stock_updates: store.getTable("stock_updates"),
      sync_queue: store.getTable("sync_queue"),
      dailyMetrics: store.getTable("dailyMetrics"),
      cashflowMetrics: store.getTable("cashflowMetrics"),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
  } catch (error) {
    console.warn("Failed to save store:", error);
  }
};

export const loadStore = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    console.log(
      "📱 Loading store from AsyncStorage:",
      stored ? "Data found" : "No data found"
    );

    if (stored) {
      const data = JSON.parse(stored);
      console.log("📊 Store data loaded:", {
        products: Object.keys(data.products || {}).length,
        categories: Object.keys(data.categories || {}).length,
        inventory: Object.keys(data.inventory || {}).length,
      });

      // Load each table
      Object.entries(data.categories || {}).forEach(([id, category]) => {
        store.setRow("categories", id, category as any);
      });

      Object.entries(data.products || {}).forEach(([id, product]) => {
        store.setRow("products", id, product as any);
      });

      Object.entries(data.inventory || {}).forEach(([id, inventory]) => {
        store.setRow("inventory", id, inventory as any);
      });

      Object.entries(data.transactions || {}).forEach(([id, transaction]) => {
        store.setRow("transactions", id, transaction as any);
      });

      Object.entries(data.transaction_items || {}).forEach(([id, item]) => {
        store.setRow("transaction_items", id, item as any);
      });

      Object.entries(data.stock_updates || {}).forEach(([id, stockUpdate]) => {
        store.setRow("stock_updates", id, stockUpdate as any);
      });

      Object.entries(data.sync_queue || {}).forEach(([id, queueItem]) => {
        store.setRow("sync_queue", id, queueItem as any);
      });

      Object.entries(data.dailyMetrics || {}).forEach(([id, metric]) => {
        store.setRow("dailyMetrics", id, metric as any);
      });

      Object.entries(data.cashflowMetrics || {}).forEach(([id, metric]) => {
        store.setRow("cashflowMetrics", id, metric as any);
      });

      console.log("✅ Store data loaded successfully into TinyBase");
    } else {
      console.log("📭 No stored data found, starting with empty store");
    }
  } catch (error) {
    console.warn("Failed to load store:", error);
  }
};

// Initialize store with data (no persistence for now)
export const initializeStore = async (): Promise<void> => {
  try {
    // Store is already initialized with empty tables
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    // Categories will be created dynamically when products are added
    // No need to initialize default categories
  } catch (error) {
    console.error("Error initializing store:", error);
  }
};

// For now, run without persistence to get the app working

// Database operations
export const db: {
  getProducts: () => Product[];
  getCategories: () => Category[];
  searchProducts: (query: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  updateStock: (productId: string, newStock: number) => void;
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
  getTransactions: () => Transaction[];
  getTransactionItems: (transactionId: string) => TransactionItem[];
  getTodayTransactions: () => Transaction[];
  getStockUpdates: () => any[];
  getInventoryForProduct: (productId: string) => any;
  getAllInventory: () => any[];
  addStockUpdate: (
    productId: string,
    oldStock: number,
    newStock: number
  ) => string;
  getCashflowMetrics: () => any;
  updateCashflowMetrics: (metrics: any) => void;
  addProduct: (productData: {
    name: string;
    description: string;
    sku: string;
    barcode?: string;
    brand?: string;
    category: string;
    price: number;
    cost?: number;
    initialStock: number;
  }) => string;
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
          color: (categories[product.category as string] as any)?.color,
          icon: (categories[product.category as string] as any)?.icon,
        }) as Product
    );
  },

  // Get all categories that are actually used by products
  getCategories: (): Array<Category & { key: string }> => {
    const products = store.getTable("products");
    const categories = store.getTable("categories");

    // Get unique category keys from products
    const usedCategoryKeys = new Set(
      Object.values(products)
        .map((product: any) => product.category)
        .filter(Boolean)
    );

    // Ensure all used categories exist in the categories table
    let categoriesUpdated = false;
    usedCategoryKeys.forEach((categoryKey) => {
      if (!categories[categoryKey]) {
        // Create a basic category entry for existing products
        store.setRow("categories", categoryKey, {
          name: categoryKey,
          color: "#6B7280", // Default gray color
          icon: "📁", // Default folder emoji
        });
        categoriesUpdated = true;
      }
    });

    // Save to persistent storage if categories were updated
    if (categoriesUpdated) {
      saveStore();
    }

    // Only return categories that are actually used by products
    return Array.from(usedCategoryKeys)
      .map((key) => {
        const category = categories[key];
        return category ? { ...category, key } : null;
      })
      .filter(Boolean) as Array<Category & { key: string }>;
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
            color: (categories[product.category as string] as any)?.color,
            icon: (categories[product.category as string] as any)?.icon,
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
            color: (categories[product.category as string] as any)?.color,
            icon: (categories[product.category as string] as any)?.icon,
          }) as Product
      );
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
    // Save to persistent storage
    saveStore();
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
    // Save to persistent storage
    saveStore();
  },

  // Get daily metrics
  getDailyMetrics: (): {
    revenue: number;
    profit: number;
    lastUpdated: string;
  } => {
    const metrics = store.getTable("dailyMetrics");
    const today = new Date().toISOString().split("T")[0]; // Use same format as metrics store

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
    const today = new Date().toISOString().split("T")[0]; // Use same format as metrics store
    const currentMetrics = store.getTable("dailyMetrics")[today] || {
      revenue: 0,
      profit: 0,
    };

    const newRevenue = ((currentMetrics.revenue as number) || 0) + revenue;
    const newProfit = ((currentMetrics.profit as number) || 0) + profit;

    store.setRow("dailyMetrics", today, {
      revenue: newRevenue,
      profit: newProfit,
      lastUpdated: new Date().toISOString(),
    });
  },

  // Get all transactions
  getTransactions: (): Transaction[] => {
    const transactions = store.getTable("transactions");
    return Object.values(transactions) as unknown as Transaction[];
  },

  // Get transaction items for a specific transaction
  getTransactionItems: (transactionId: string): TransactionItem[] => {
    const transactionItems = store.getTable("transaction_items");
    return Object.values(transactionItems).filter(
      (item) => item.transaction_id === transactionId
    ) as unknown as TransactionItem[];
  },

  // Get today's transactions
  getTodayTransactions: (): Transaction[] => {
    const transactions = store.getTable("transactions");
    const today = new Date().toISOString().split("T")[0];

    return Object.values(transactions).filter((transaction) =>
      (transaction.created_at as string).startsWith(today)
    ) as unknown as Transaction[];
  },

  // Get all stock updates
  getStockUpdates: (): any[] => {
    const stockUpdates = store.getTable("stock_updates");
    return Object.values(stockUpdates);
  },

  // Get inventory data for a specific product
  getInventoryForProduct: (productId: string): any => {
    const inventory = store.getTable("inventory");
    const inventoryItems = Object.values(inventory);

    // Find inventory item for this product
    const inventoryItem = inventoryItems.find(
      (item: any) => item.product_id === productId && item.is_active
    );

    return inventoryItem || null;
  },

  // Get all inventory data
  getAllInventory: (): any[] => {
    const inventory = store.getTable("inventory");
    const inventoryItems = Object.values(inventory);

    // Return all active inventory items
    return inventoryItems.filter((item: any) => item.is_active);
  },

  // Update stock for a product
  updateStock: (productId: string, newStock: number): void => {
    const inventory = store.getTable("inventory");
    const inventoryItems = Object.values(inventory);

    // Find inventory item for this product
    const inventoryItem = inventoryItems.find(
      (item: any) => item.product_id === productId && item.is_active
    );

    if (inventoryItem) {
      // Update the stock in the inventory table
      store.setRow("inventory", inventoryItem.id as string, {
        ...inventoryItem,
        stock: newStock,
        updated_at: new Date().toISOString(),
      });

      // Save to persistent storage
      saveStore();
    }
  },

  // Add stock update record for sync
  addStockUpdate: (
    productId: string,
    oldStock: number,
    newStock: number
  ): string => {
    const stockUpdateId = `stock-${Date.now()}`;

    store.setRow("stock_updates", stockUpdateId, {
      id: stockUpdateId,
      product_id: productId,
      old_stock: oldStock,
      new_stock: newStock,
      created_at: new Date().toISOString(),
      synced: false,
    });

    // Save to persistent storage
    saveStore();

    return stockUpdateId;
  },

  // Get cashflow metrics
  getCashflowMetrics: (): any => {
    const metrics = store.getTable("cashflowMetrics");
    const today = new Date().toDateString();

    if (metrics[today]) {
      return metrics[today];
    }

    // Return default values
    return {
      openingCashBalance: 0,
      currentCashBalance: 0,
      totalCashReceived: 0,
      totalChangeGiven: 0,
      totalCashSales: 0,
      netCashFlow: 0,
      lastUpdated: new Date().toISOString(),
    };
  },

  // Update cashflow metrics
  updateCashflowMetrics: (metrics: any): void => {
    const today = new Date().toDateString();
    store.setRow("cashflowMetrics", today, {
      ...metrics,
      lastUpdated: new Date().toISOString(),
    });
    // Save to persistent storage
    saveStore();
  },

  // Add new product
  addProduct: (productData: {
    name: string;
    description: string;
    sku: string;
    barcode?: string;
    brand?: string;
    category: string;
    price: number;
    cost?: number;
    initialStock: number;
  }): string => {
    const productId = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create product record
    const product = {
      id: productId,
      sku: productData.sku,
      barcode: productData.barcode || null,
      name: productData.name,
      description: productData.description || null,
      category: productData.category,
      brand: productData.brand || null,
      images: null, // TODO: Add image support later
      created_at: new Date().toISOString(),
      price: productData.price, // Legacy field for backward compatibility
    };

    // Save product to products table
    store.setRow("products", productId, product);

    // Create inventory record
    const inventoryId = `inv-${productId}`;
    const inventory = {
      id: inventoryId,
      product_id: productId,
      user_id: "local-user", // For standalone mode, use a fixed user ID
      stock: productData.initialStock,
      sell_price: productData.price,
      buy_price: productData.cost || 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save inventory to inventory table
    store.setRow("inventory", inventoryId, inventory);

    // Ensure category exists in categories table
    const categories = store.getTable("categories");
    if (!categories[productData.category]) {
      // Create a basic category entry if it doesn't exist
      store.setRow("categories", productData.category, {
        name: productData.category,
        color: "#6B7280", // Default gray color
        icon: "📁", // Default folder emoji
      });
    }

    // Save to persistent storage
    saveStore();

    return productId;
  },
};

// Sync Queue Utilities
export const syncQueue = {
  // Add operation to sync queue
  add: (operation: {
    type: "sale" | "sale_items" | "inventory" | "stock_update";
    data: any;
    retryCount?: number;
  }) => {
    const id = Crypto.randomUUID();
    store.setRow("sync_queue", id, {
      id,
      type: operation.type,
      data: JSON.stringify(operation.data),
      status: "pending",
      retryCount: operation.retryCount || 0,
      createdAt: new Date().toISOString(),
    });
    return id;
  },

  // Get all pending operations
  getPending: () => {
    const queue = store.getTable("sync_queue");
    return Object.values(queue).filter((item) => item.status === "pending");
  },

  // Mark operation as completed
  markCompleted: (id: string) => {
    store.setRow("sync_queue", id, { status: "completed" });
  },

  // Increment retry count
  incrementRetry: (id: string) => {
    const item = store.getRow("sync_queue", id);
    if (item) {
      store.setRow("sync_queue", id, {
        retryCount: ((item.retryCount as number) || 0) + 1,
      });
    }
  },

  // Remove completed operations (cleanup)
  cleanup: () => {
    const queue = store.getTable("sync_queue");
    Object.entries(queue).forEach(([id, item]) => {
      if (item.status === "completed") {
        store.delRow("sync_queue", id);
      }
    });
  },

  // Get queue status
  getStatus: () => {
    const queue = store.getTable("sync_queue");
    const items = Object.values(queue);
    return {
      total: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      completed: items.filter((item) => item.status === "completed").length,
      items: items.map((item) => ({
        id: item.id,
        type: item.type,
        status: item.status,
        retryCount: item.retryCount || 0,
        createdAt: item.createdAt,
      })),
    };
  },
};

import { createStore } from "tinybase";
import { getProfitLevel } from "../utils/profitLevels";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  Product,
  Category,
  Transaction,
  TransactionItem,
} from "../types/database";

// TinyBase store - persistent, populated by queries from Supabase

// Create the main store (empty, will be populated by queries)
export const store = createStore()
  .setTable("categories", {})
  .setTable("products", {})
  .setTable("inventory", {})
  .setTable("transactions", {})
  .setTable("transaction_items", {})
  .setTable("stock_updates", {}) // For stock update sync
  .setTable("sync_queue", {}); // For persistent sync operations

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
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storeData));
  } catch (error) {
    console.warn("Failed to save store:", error);
  }
};

export const loadStore = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);

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
  getInventoryForProduct: (productId: string) => any;
  addStockUpdate: (
    productId: string,
    oldStock: number,
    newStock: number
  ) => string;
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
  getCategories: (): Array<Category & { key: string }> => {
    return Object.entries(store.getTable("categories")).map(
      ([key, category]) => ({ ...category, key })
    ) as Array<Category & { key: string }>;
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
};

// Sync Queue Utilities
export const syncQueue = {
  // Add operation to sync queue
  add: (operation: {
    type: "sale" | "sale_items" | "inventory" | "stock_update";
    data: any;
    retryCount?: number;
  }) => {
    const id = crypto.randomUUID();
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

import { createStore } from "tinybase";
import { getProfitLevel } from "../utils/profitLevels";
import type {
  Product,
  Category,
  Transaction,
  TransactionItem,
} from "../types/database";

// TinyBase store - empty, populated by queries from Supabase

// Create the main store (empty, will be populated by queries)
export const store = createStore()
  .setTable("categories", {})
  .setTable("products", {})
  .setTable("inventory", {})
  .setTable("transactions", {})
  .setTable("transaction_items", {});

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

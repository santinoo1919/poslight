export interface Product {
  id: string;
  name: string;
  buyPrice: number; // Cost price (what we paid)
  sellPrice: number; // Selling price (what customer pays)
  margin: number; // Profit margin (sellPrice - buyPrice)
  stock: number;
  category: string;
  barcode: string;
  description: string;
  categoryName: string;
  color: string;
  icon: string;
}

export interface Category {
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  total_amount: number;
  total_cost: number; // Total cost of items sold
  total_profit: number; // Total profit from this transaction
  payment_method: string;
  status: string;
  created_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Store {
  categories: Record<string, Category>;
  products: Record<string, Product>;
  transactions: Record<string, Transaction>;
  transaction_items: Record<string, TransactionItem>;
  dailyMetrics: {
    revenue: number;
    profit: number;
    lastUpdated: string;
  };
}

export interface DatabaseOperations {
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
}

// New interfaces for profit tracking
export interface ProfitAnalytics {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number; // Percentage
  averageProfitPerSale: number;
  topProfitableProducts: Array<{
    product: Product;
    totalProfit: number;
    unitsSold: number;
  }>;
}

export interface DailySalesSummary {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  transactionCount: number;
  averageOrderValue: number;
}

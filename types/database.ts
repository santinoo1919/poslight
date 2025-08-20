export interface Product {
  id: string;
  name: string;
  price: number;
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
}

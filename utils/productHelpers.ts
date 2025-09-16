import type { Product, Category } from "../types/database";
import { calculateProfitLevel } from "./profitLevels";

// 🎯 PRODUCT DATA ENRICHMENT
export const enrichProductWithCategory = (
  product: Omit<Product, "id">,
  productId: string,
  categories: Record<string, Category>
): Product => ({
  id: productId,
  ...product,
  categoryName: categories[product.category]?.name || product.category,
  color: categories[product.category]?.color || "#3B82F6",
  icon: categories[product.category]?.icon || "📦",
});

// 🎯 BULK PRODUCT ENRICHMENT
export const enrichProductsWithCategories = (
  productsData: Record<string, Omit<Product, "id">>,
  categoriesData: Record<string, Category>
): Product[] => {
  return Object.entries(productsData).map(([productId, product]) =>
    enrichProductWithCategory(product, productId, categoriesData)
  );
};

// 🎯 PROFIT CALCULATIONS
export const calculateProductProfit = (
  buy_price: number,
  sell_price: number
): number => {
  return sell_price - buy_price;
};

export const enrichProductWithProfit = (product: Product): Product => ({
  ...product,
  profit: calculateProductProfit(
    product.buy_price || 0,
    product.sell_price || product.price || 0
  ),
  profitLevel: calculateProfitLevel(
    product.buy_price || 0,
    product.sell_price || product.price || 0
  ),
});

// 🎯 STOCK OPERATIONS
export const updateProductStock = (
  products: Product[],
  productId: string,
  newStock: number
): Product[] => {
  return products.map((product) =>
    product.id === productId ? { ...product, stock: newStock } : product
  );
};

export const decrementProductStock = (
  products: Product[],
  productId: string,
  quantity: number
): Product[] => {
  return products.map((product) => {
    if (product.id === productId) {
      const currentStock = product.stock || 0;
      const newStock = Math.max(0, currentStock - quantity);
      return { ...product, stock: newStock };
    }
    return product;
  });
};

// 🎯 SEARCH & FILTERING
export const searchProductsByName = (
  products: Product[],
  query: string
): Product[] => {
  if (!query.trim()) return products;

  const queryLower = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(queryLower) ||
      product.category.toLowerCase().includes(queryLower) ||
      (product.barcode && product.barcode.includes(query))
  );
};

export const filterProductsByCategory = (
  products: Product[],
  category: string | null
): Product[] => {
  if (!category || category === "Show All") return products;

  const categoryLower = category.toLowerCase();
  return products.filter(
    (product) => product.category.toLowerCase() === categoryLower
  );
};

// 🎯 SALE CALCULATIONS
export const calculateSaleTotals = (
  products: any[], // Changed to any[] to handle CartProduct with inventory
  quantities: Record<string, number>
) => {
  let totalAmount = 0;
  let totalProfit = 0;

  Object.entries(quantities).forEach(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Handle both direct product pricing and inventory pricing
      const price =
        product.inventory?.sell_price ||
        product.sell_price ||
        product.price ||
        0;
      const buyPrice = product.inventory?.buy_price || product.buy_price || 0;

      totalAmount += price * quantity;
      totalProfit += (price - buyPrice) * quantity;
    }
  });

  return { totalAmount, totalProfit };
};

// 🎯 VALIDATION HELPERS
export const isValidProduct = (product: any): product is Product => {
  return (
    product &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    typeof product.stock === "number" &&
    typeof product.category === "string"
  );
};

export const validateProductArray = (
  products: any[]
): products is Product[] => {
  return Array.isArray(products) && products.every(isValidProduct);
};

// 🎯 UTILITY FUNCTIONS
export const getProductById = (
  products: Product[],
  productId: string
): Product | undefined => {
  return products.find((product) => product.id === productId);
};

export const getProductsByCategory = (
  products: Product[],
  category: string
): Product[] => {
  return products.filter((product) => product.category === category);
};

export const sortProductsBy = (
  products: Product[],
  sortBy: "name" | "price" | "stock" | "profit" = "name",
  order: "asc" | "desc" = "asc"
): Product[] => {
  const sorted = [...products].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];

    if (sortBy === "name") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

// 🎯 PRODUCT GRID LOGIC HELPERS
export const getMostBoughtProducts = (
  products: Product[],
  count: number = 4,
  minStock: number = 50
): Product[] => {
  return products.filter((product) => product.stock > minStock).slice(0, count);
};

export const getMainGridProducts = (
  products: Product[],
  mostBoughtProducts: Product[]
): Product[] => {
  return products.filter(
    (item) => !mostBoughtProducts.some((mb) => mb.id === item.id)
  );
};

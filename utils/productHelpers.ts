import type { Product } from "../types/database";

// 🎯 PROFIT CALCULATIONS
export const calculateProductProfit = (
  buy_price: number,
  sell_price: number
): number => {
  return sell_price - buy_price;
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
  if (!category) return products;

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
  sortBy: "name" | "price" = "name",
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

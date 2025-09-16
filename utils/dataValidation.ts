import type {
  Product,
  Category,
  ValidatedProduct,
  ValidatedProducts,
} from "../types/database";
import {
  validateProduct,
  validateProducts,
  validateCategory,
  validateCategories,
  safeParseProduct,
  safeParseProducts,
} from "./schemas";

// Type guards using Zod validation
export const isValidProduct = (product: any): product is Product => {
  return validateProduct(product).success;
};

export const isValidCategory = (category: any): category is Category => {
  return validateCategory(category).success;
};

// Data structure validation using Zod
export const validateProductData = (
  products: any[]
): { valid: ValidatedProduct[]; invalid: any[]; errors: string[] } => {
  const result = validateProducts(products);

  if (result.success) {
    return {
      valid: result.data,
      invalid: [],
      errors: [],
    };
  } else {
    return {
      valid: [],
      invalid: products,
      errors: result.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      ),
    };
  }
};

// Runtime data integrity check using Zod
export const ensureDataIntegrity = (
  data: any,
  expectedType: "products" | "categories"
): boolean => {
  try {
    if (expectedType === "products") {
      const result = validateProducts(data);

      if (!result.success) {
        console.error("❌ Data integrity check failed:", {
          total: data?.length || 0,
          errors: result.error.issues
            .slice(0, 3)
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`),
        });
        return false;
      }

      return true;
    }

    if (expectedType === "categories") {
      const result = validateCategories(data);

      if (!result.success) {
        console.error("❌ Categories integrity check failed:", {
          total: data?.length || 0,
          errors: result.error.issues
            .slice(0, 3)
            .map((issue) => `${issue.path.join(".")}: ${issue.message}`),
        });
        return false;
      }

      return true;
    }

    return true;
  } catch (error) {
    console.error("❌ Data integrity check crashed:", error);
    return false;
  }
};

// Safe data access using Zod with fallbacks
export const safeGetProduct = (product: any): Partial<Product> => {
  // Try to validate with Zod first
  const validated = safeParseProduct(product);
  if (validated) {
    return validated;
  }

  // Fallback to safe defaults if validation fails
  if (!product || typeof product !== "object") {
    return {};
  }

  return {
    id: product.id || "unknown",
    name: product.name || "Unnamed Product",
    buy_price: typeof product.buy_price === "number" ? product.buy_price : 0,
    sell_price: typeof product.sell_price === "number" ? product.sell_price : 0,
    stock: typeof product.stock === "number" ? product.stock : 0,
    category: product.category || "unknown",
    barcode: product.barcode || "unknown",
    description: product.description || "No description",
    categoryName: product.categoryName || "Unknown Category",
    color: product.color || "#3B82F6",
    icon: product.icon || "📦",
    profit: typeof product.profit === "number" ? product.profit : 0,
    profitLevel: product.profitLevel || "low",
  };
};

// Data migration safety
export const safeMigrateData = <T>(
  oldData: any,
  migrationFn: (data: any) => T
): T => {
  try {
    const migrated = migrationFn(oldData);
    return migrated;
  } catch (error) {
    console.error("Data migration failed:", error);
    // Return safe default data
    return {} as T;
  }
};

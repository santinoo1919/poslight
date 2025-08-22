import type { Product, Category } from "../types/database";

// Type guards to ensure data structure integrity
export const isValidProduct = (product: any): product is Product => {
  return (
    product &&
    typeof product === "object" &&
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.buyPrice === "number" &&
    typeof product.sellPrice === "number" &&
    typeof product.stock === "number" &&
    typeof product.category === "string" &&
    typeof product.barcode === "string" &&
    typeof product.description === "string" &&
    typeof product.categoryName === "string" &&
    typeof product.color === "string" &&
    typeof product.icon === "string" &&
    typeof product.profit === "number" &&
    typeof product.profitLevel === "string" &&
    ["high", "medium", "low"].includes(product.profitLevel)
  );
};

export const isValidCategory = (category: any): category is Category => {
  return (
    category &&
    typeof category === "object" &&
    typeof category.name === "string" &&
    typeof category.color === "string" &&
    typeof category.icon === "string"
  );
};

// Data structure validation
export const validateProductData = (products: any[]): { valid: Product[]; invalid: any[]; errors: string[] } => {
  const valid: Product[] = [];
  const invalid: any[] = [];
  const errors: string[] = [];

  products.forEach((product, index) => {
    if (isValidProduct(product)) {
      valid.push(product);
    } else {
      invalid.push(product);
      errors.push(`Product at index ${index} is invalid: ${JSON.stringify(product)}`);
    }
  });

  return { valid, invalid, errors };
};

// Runtime data integrity check
export const ensureDataIntegrity = (data: any, expectedType: 'products' | 'categories'): boolean => {
  try {
    if (expectedType === 'products') {
      if (!Array.isArray(data)) {
        console.error("❌ Data integrity check failed: products is not an array");
        return false;
      }
      
      const { valid, invalid, errors } = validateProductData(data);
      
      if (invalid.length > 0) {
        console.error("❌ Data integrity check failed:", {
          total: data.length,
          valid: valid.length,
          invalid: invalid.length,
          errors: errors.slice(0, 3) // Show first 3 errors
        });
        return false;
      }
      
      console.log("✅ Data integrity check passed:", {
        total: data.length,
        valid: valid.length,
        invalid: invalid.length
      });
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("❌ Data integrity check crashed:", error);
    return false;
  }
};

// Safe data access with fallbacks
export const safeGetProduct = (product: any): Partial<Product> => {
  if (!product || typeof product !== 'object') {
    return {};
  }
  
  return {
    id: product.id || 'unknown',
    name: product.name || 'Unnamed Product',
    buyPrice: typeof product.buyPrice === 'number' ? product.buyPrice : 0,
    sellPrice: typeof product.sellPrice === 'number' ? product.sellPrice : 0,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    category: product.category || 'unknown',
    barcode: product.barcode || 'unknown',
    description: product.description || 'No description',
    categoryName: product.categoryName || 'Unknown Category',
    color: product.color || '#3B82F6',
    icon: product.icon || '📦',
    profit: typeof product.profit === 'number' ? product.profit : 0,
    profitLevel: product.profitLevel || 'low'
  };
};

// Data migration safety
export const safeMigrateData = <T>(oldData: any, migrationFn: (data: any) => T): T => {
  try {
    console.log("🔄 Starting safe data migration...");
    const migrated = migrationFn(oldData);
    console.log("✅ Data migration completed successfully");
    return migrated;
  } catch (error) {
    console.error("❌ Data migration failed:", error);
    console.log("🔄 Falling back to default data...");
    // Return safe default data
    return {} as T;
  }
};

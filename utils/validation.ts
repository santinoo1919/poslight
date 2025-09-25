import { z } from "zod";

// ============================================================================
// CORE DATA SCHEMAS
// ============================================================================

export const ProductSchema = z.object({
  id: z.string().min(1, "ID is required"),
  sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
  barcode: z.string().optional(),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  images: z.any().optional(),
  created_at: z.string(),

  // UI fields
  color: z.string().optional(),
  icon: z.string().optional(),
  categoryName: z.string().optional(),
  price: z.number().optional(), // Legacy field
});

export const InventorySchema = z.object({
  id: z.string().min(1, "Inventory ID is required"),
  product_id: z.string().min(1, "Product ID is required"),
  user_id: z.string().min(1, "User ID is required"),
  buy_price: z
    .number()
    .positive("Buy price must be positive")
    .max(10000, "Buy price too high"),
  sell_price: z
    .number()
    .positive("Sell price must be positive")
    .max(10000, "Sell price too high"),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be non-negative")
    .max(10000, "Stock too high"),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CategorySchema = z.object({
  key: z.string().min(1, "Category key is required"),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  icon: z.string().min(1, "Icon is required").max(10, "Icon too long"),
});

// ============================================================================
// BUSINESS LOGIC SCHEMAS
// ============================================================================

export const SaleInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .int()
    .positive("Quantity must be positive")
    .max(1000, "Quantity too high"),
  sellPrice: z.number().positive("Sell price must be positive"),
  buyPrice: z.number().positive("Buy price must be positive"),
});

export const StockUpdateSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  newStock: z
    .number()
    .int()
    .min(0, "Stock cannot be negative")
    .max(10000, "Stock too high"),
  oldStock: z.number().int().min(0, "Old stock cannot be negative"),
});

export const CalculationInputSchema = z.object({
  products: z.array(
    z.object({
      id: z.string(),
      inventory: InventorySchema.optional(),
      price: z.number().optional(),
      buy_price: z.number().optional(),
    })
  ),
  quantities: z.record(z.string(), z.number().int().positive()),
});

export const CalculationResultSchema = z.object({
  totalAmount: z
    .number()
    .finite("Total amount must be finite")
    .min(0, "Total cannot be negative"),
  totalProfit: z.number().finite("Total profit must be finite"),
});

// ============================================================================
// TRANSACTION SCHEMAS
// ============================================================================

export const TransactionSchema = z.object({
  id: z.string().min(1, "Transaction ID is required"),
  total_amount: z.number().positive("Total amount must be positive"),
  total_cost: z.number().min(0, "Total cost cannot be negative"),
  total_profit: z.number(),
  payment_method: z.string().min(1, "Payment method is required"),
  status: z.enum(["completed", "pending", "cancelled"]),
  created_at: z.string(),
});

export const TransactionItemSchema = z.object({
  id: z.string().min(1, "Item ID is required"),
  transaction_id: z.string().min(1, "Transaction ID is required"),
  product_id: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  unit_price: z.number().positive("Unit price must be positive"),
  total_price: z.number().positive("Total price must be positive"),
});

// ============================================================================
// FORM INPUT SCHEMAS
// ============================================================================

export const AddProductInputSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    sku: z.string().min(1, "SKU is required").max(50, "SKU too long"),
    sellPrice: z
      .number()
      .positive("Sell price must be positive")
      .max(10000, "Sell price too high"),
    buyPrice: z
      .number()
      .positive("Buy price must be positive")
      .max(10000, "Buy price too high"),
    stock: z
      .number()
      .int()
      .min(0, "Stock must be non-negative")
      .max(10000, "Stock too high"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().optional(),
    barcode: z.string().optional(),
    description: z.string().optional(),
    size: z.string().optional(),
  })
  .refine((data) => data.sellPrice > data.buyPrice, {
    message: "Sell price must be greater than buy price",
    path: ["sellPrice"],
  });

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

// Core data validation
export const validateProduct = (data: unknown) => ProductSchema.safeParse(data);
export const validateInventory = (data: unknown) =>
  InventorySchema.safeParse(data);
export const validateCategory = (data: unknown) =>
  CategorySchema.safeParse(data);

// Array validation
export const validateProducts = (data: unknown) =>
  z.array(ProductSchema).safeParse(data);
export const validateInventories = (data: unknown) =>
  z.array(InventorySchema).safeParse(data);
export const validateCategories = (data: unknown) =>
  z.array(CategorySchema).safeParse(data);

// Business logic validation
export const validateSaleInput = (data: unknown) =>
  SaleInputSchema.safeParse(data);
export const validateStockUpdate = (data: unknown) =>
  StockUpdateSchema.safeParse(data);
export const validateCalculationInput = (data: unknown) =>
  CalculationInputSchema.safeParse(data);
export const validateCalculationResult = (data: unknown) =>
  CalculationResultSchema.safeParse(data);

// Form validation
export const validateAddProductInput = (data: unknown) =>
  AddProductInputSchema.safeParse(data);

// Transaction validation
export const validateTransaction = (data: unknown) =>
  TransactionSchema.safeParse(data);
export const validateTransactionItem = (data: unknown) =>
  TransactionItemSchema.safeParse(data);

// ============================================================================
// SAFE PARSE FUNCTIONS WITH ERROR HANDLING
// ============================================================================

export const safeParseProduct = (data: unknown) => {
  const result = validateProduct(data);
  if (result.success) {
    return result.data;
  }
  console.error("Product validation failed:", result.error.issues);
  return null;
};

export const safeParseAddProductInput = (data: unknown) => {
  const result = validateAddProductInput(data);
  if (result.success) {
    return result.data;
  }
  console.error("Add product input validation failed:", result.error.issues);
  return null;
};

export const safeParseSaleInput = (data: unknown) => {
  const result = validateSaleInput(data);
  if (result.success) {
    return result.data;
  }
  console.error("Sale input validation failed:", result.error.issues);
  return null;
};

export const safeParseCalculationInput = (data: unknown) => {
  const result = validateCalculationInput(data);
  if (result.success) {
    return result.data;
  }
  console.error("Calculation input validation failed:", result.error.issues);
  return null;
};

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

export const getValidationErrors = (result: z.ZodSafeParseError<any>) => {
  return result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path}: ${issue.message}`;
  });
};

export const formatValidationErrors = (errors: string[]) => {
  return errors.slice(0, 3).join("\n"); // Show first 3 errors
};

// ============================================================================
// DATA INTEGRITY CHECKS
// ============================================================================

export const validateDataIntegrity = (
  data: any,
  type: "products" | "categories" | "inventories"
) => {
  try {
    let result: z.SafeParseReturnType<any, any>;

    switch (type) {
      case "products":
        result = validateProducts(data);
        break;
      case "categories":
        result = validateCategories(data);
        break;
      case "inventories":
        result = validateInventories(data);
        break;
      default:
        return false;
    }

    if (!result.success) {
      console.error(`❌ Data integrity check failed for ${type}:`, {
        total: data?.length || 0,
        errors: getValidationErrors(result).slice(0, 3),
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Data integrity check crashed for ${type}:`, error);
    return false;
  }
};

// ============================================================================
// BUSINESS RULE VALIDATIONS
// ============================================================================

export const validateProfitMargin = (buyPrice: number, sellPrice: number) => {
  if (sellPrice <= buyPrice) {
    return {
      isValid: false,
      message: "Sell price must be greater than buy price",
    };
  }

  const margin = ((sellPrice - buyPrice) / sellPrice) * 100;

  if (margin > 1000) {
    return {
      isValid: false,
      message: "Profit margin seems unrealistic (>1000%)",
    };
  }

  return {
    isValid: true,
    message: `Profit margin: ${margin.toFixed(1)}%`,
  };
};

export const validateStockOperation = (
  currentStock: number,
  operation: "add" | "subtract",
  amount: number
) => {
  if (amount <= 0) {
    return {
      isValid: false,
      message: "Amount must be positive",
    };
  }

  if (operation === "subtract" && amount > currentStock) {
    return {
      isValid: false,
      message: `Cannot subtract ${amount} from stock of ${currentStock}`,
    };
  }

  return {
    isValid: true,
    message: "Stock operation is valid",
  };
};

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ValidatedProduct = z.infer<typeof ProductSchema>;
export type ValidatedInventory = z.infer<typeof InventorySchema>;
export type ValidatedCategory = z.infer<typeof CategorySchema>;
export type ValidatedSaleInput = z.infer<typeof SaleInputSchema>;
export type ValidatedAddProductInput = z.infer<typeof AddProductInputSchema>;
export type ValidatedCalculationResult = z.infer<
  typeof CalculationResultSchema
>;

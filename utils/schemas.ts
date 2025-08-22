import { z } from "zod";

// Product schema with comprehensive validation
export const ProductSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  buyPrice: z
    .number()
    .positive("Buy price must be positive")
    .max(10000, "Buy price too high"),
  sellPrice: z
    .number()
    .positive("Sell price must be positive")
    .max(10000, "Sell price too high"),
  margin: z.number().min(0, "Margin cannot be negative"),
  stock: z
    .number()
    .int()
    .min(0, "Stock must be non-negative")
    .max(10000, "Stock too high"),
  category: z.string().min(1, "Category is required"),
  barcode: z.string().min(1, "Barcode is required").max(50, "Barcode too long"),
  description: z.string().max(500, "Description too long"),
  categoryName: z.string().min(1, "Category name is required"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .max(7, "Color code too long"),
  icon: z.string().min(1, "Icon is required").max(10, "Icon too long"),
  profit: z.number().min(0, "Profit cannot be negative"),
  profitLevel: z.enum(["high", "medium", "low"]),
});

// Category schema
export const CategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  icon: z.string().min(1, "Icon is required").max(10, "Icon too long"),
});

// Array schemas for validation
export const ProductsArraySchema = z.array(ProductSchema);
export const CategoriesArraySchema = z.array(CategorySchema);

// Store schema for complete data validation
export const StoreSchema = z.object({
  categories: z.record(z.string(), CategorySchema),
  products: z.record(z.string(), ProductSchema),
  transactions: z.record(z.string(), z.any()), // We'll define this later
  transaction_items: z.record(z.string(), z.any()), // We'll define this later
  dailyMetrics: z.object({
    revenue: z.number().min(0, "Revenue cannot be negative"),
    profit: z.number(),
    lastUpdated: z.string(),
  }),
});

// Type inference - automatic TypeScript types!
import type {
  ValidatedProduct,
  ValidatedCategory,
  ValidatedProducts,
  ValidatedCategories,
  ValidatedStore,
} from "../types/database";

// Validation functions with detailed error reporting
export const validateProduct = (data: unknown) => {
  return ProductSchema.safeParse(data);
};

export const validateProducts = (data: unknown) => {
  return ProductsArraySchema.safeParse(data);
};

export const validateCategory = (data: unknown) => {
  return CategorySchema.safeParse(data);
};

export const validateCategories = (data: unknown) => {
  return CategoriesArraySchema.safeParse(data);
};

export const validateStore = (data: unknown) => {
  return StoreSchema.safeParse(data);
};

// Helper function to get validation errors as readable strings
export const getValidationErrors = (result: z.ZodSafeParseError<any>) => {
  return result.error.issues.map((issue) => {
    const path = issue.path.join(".");
    return `${path}: ${issue.message}`;
  });
};

// Safe data access with validation
export const safeParseProduct = (data: unknown): ValidatedProduct | null => {
  const result = validateProduct(data);
  if (result.success) {
    return result.data;
  }
  console.error(
    "Product validation failed:",
    result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    )
  );
  return null;
};

export const safeParseProducts = (data: unknown): ValidatedProducts | null => {
  const result = validateProducts(data);
  if (result.success) {
    return result.data;
  }
  console.error(
    "Products validation failed:",
    result.error.issues.map(
      (issue) => `${issue.path.join(".")}: ${issue.message}`
    )
  );
  return null;
};

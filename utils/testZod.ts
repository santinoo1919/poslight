// Simple test to verify Zod schemas are working
import { ProductSchema, validateProduct } from "./schemas";

// Test data
const validProduct = {
  id: "test-1",
  name: "Test Product",
  buyPrice: 10.5,
  sellPrice: 15.99,
  margin: 5.49,
  stock: 100,
  category: "test",
  barcode: "123456789",
  description: "A test product",
  categoryName: "Test Category",
  color: "#FF0000",
  icon: "🧪",
  profit: 5.49,
  profitLevel: "medium" as const,
};

const invalidProduct = {
  id: "", // Empty ID - should fail
  name: "Test Product",
  buyPrice: -5, // Negative price - should fail
  sellPrice: 15.99,
  margin: 5.49,
  stock: 100,
  category: "test",
  barcode: "123456789",
  description: "A test product",
  categoryName: "Test Category",
  color: "#FF0000",
  icon: "🧪",
  profit: 5.49,
  profitLevel: "medium" as const,
};

// Test function
export const testZodSchemas = () => {
  console.log("🧪 Testing Zod schemas...");

  // Test valid product
  const validResult = validateProduct(validProduct);
  if (validResult.success) {
    console.log("✅ Valid product validation passed");
  } else {
    console.error(
      "❌ Valid product validation failed:",
      validResult.error.issues
    );
  }

  // Test invalid product
  const invalidResult = validateProduct(invalidProduct);
  if (!invalidResult.success) {
    console.log(
      "✅ Invalid product correctly caught:",
      invalidResult.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      )
    );
  } else {
    console.error("❌ Invalid product should have failed validation");
  }

  console.log("🧪 Zod schema testing completed");
};

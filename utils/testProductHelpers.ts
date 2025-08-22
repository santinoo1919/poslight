import {
  enrichProductWithCategory,
  calculateProductProfit,
  updateProductStock,
  searchProductsByName,
  filterProductsByCategory,
  calculateSaleTotals,
} from "./productHelpers";

// Test data
const mockCategories = {
  beverages: { name: "Beverages", color: "#10B981", icon: "🥤" },
  snacks: { name: "Snacks", color: "#F59E0B", icon: "🍿" },
};

const mockProduct = {
  name: "Test Product",
  price: 10,
  sellPrice: 15,
  buyPrice: 8,
  stock: 100,
  category: "beverages",
  barcode: "123456",
};

const mockProducts = [
  { ...mockProduct, id: "1", category: "beverages" },
  { ...mockProduct, id: "2", name: "Snack Item", category: "snacks" },
  { ...mockProduct, id: "3", name: "Another Drink", category: "beverages" },
];

// Test function
export const testProductHelpers = () => {
  console.log("🧪 Testing Product Helper Functions...");

  // Test 1: Product enrichment
  try {
    const enriched = enrichProductWithCategory(
      mockProduct,
      "test-1",
      mockCategories
    );
    console.log(
      "✅ Product enrichment:",
      enriched.categoryName === "Beverages"
    );
  } catch (error) {
    console.error("❌ Product enrichment failed:", error);
  }

  // Test 2: Profit calculation
  try {
    const profit = calculateProductProfit(8, 15);
    console.log("✅ Profit calculation:", profit === 7);
  } catch (error) {
    console.error("❌ Profit calculation failed:", error);
  }

  // Test 3: Stock update
  try {
    const updated = updateProductStock(mockProducts, "1", 50);
    const product = updated.find((p) => p.id === "1");
    console.log("✅ Stock update:", product?.stock === 50);
  } catch (error) {
    console.error("❌ Stock update failed:", error);
  }

  // Test 4: Search
  try {
    const searchResults = searchProductsByName(mockProducts, "drink");
    console.log("✅ Search:", searchResults.length === 1);
  } catch (error) {
    console.error("❌ Search failed:", error);
  }

  // Test 5: Category filter
  try {
    const beverages = filterProductsByCategory(mockProducts, "beverages");
    console.log("✅ Category filter:", beverages.length === 2);
  } catch (error) {
    console.error("❌ Category filter failed:", error);
  }

  // Test 6: Sale totals
  try {
    const quantities = { "1": 2, "2": 1 };
    const totals = calculateSaleTotals(mockProducts, quantities);
    console.log(
      "✅ Sale totals:",
      totals.totalAmount === 45 && totals.totalProfit === 9
    );
  } catch (error) {
    console.error("❌ Sale totals failed:", error);
  }

  console.log("🏁 Product helper tests completed!");
};

// Run tests if this file is executed directly
if (typeof window !== "undefined") {
  // Browser environment
  (window as any).testProductHelpers = testProductHelpers;
} else {
  // Node environment
  testProductHelpers();
}

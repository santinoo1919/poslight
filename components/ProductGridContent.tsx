import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProductCard from "./ProductCard";
import QuickAccessSection from "./QuickAccessSection";
import type { Product } from "../types/database";

// Memoized ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = React.memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these critical props actually changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.sellPrice === nextProps.product.sellPrice &&
    prevProps.product.buyPrice === nextProps.product.buyPrice
  );
});

interface ProductGridContentProps {
  products: Product[];
  allProducts: Product[];
  onProductPress: (product: Product) => void;
  selectedProductForQuantity: Product | null;
  currentCategory: string | null;
}

export default function ProductGridContent({
  products,
  allProducts,
  onProductPress,
  selectedProductForQuantity,
  currentCategory,
}: ProductGridContentProps) {
  // 🔍 COMPREHENSIVE DEBUGGING - ONE TIME ONLY
  console.log("🚨 COMPREHENSIVE DEBUG START 🚨");

  // Force console expansion with console.dir
  console.dir("📊 INPUT DATA:", {
    products: {
      type: typeof products,
      isArray: Array.isArray(products),
      length: products?.length,
      isNull: products === null,
      isUndefined: products === undefined,
      firstItem: products?.[0],
      firstItemType: typeof products?.[0],
    },
    allProducts: {
      type: typeof allProducts,
      isArray: Array.isArray(allProducts),
      length: allProducts?.length,
    },
    currentCategory,
  });

  // Show first product structure if exists
  if (products && products.length > 0) {
    console.log("🔍 FIRST PRODUCT STRUCTURE:");
    console.table({
      id: products[0]?.id,
      name: products[0]?.name,
      stock: products[0]?.stock,
      hasId: !!products[0]?.id,
      allKeys: Object.keys(products[0] || {}),
    });

    // Also show full product as JSON
    console.log("🔍 FULL PRODUCT JSON:");
    console.log(JSON.stringify(products[0], null, 2));
  }

  // Get most bought products (for now, just take first 4 with good stock)
  const mostBoughtProducts = products
    .filter((product) => product.stock > 50) // Good stock availability
    .slice(0, 4);

  // Filter out most bought products from main grid to avoid duplication
  const mainGridProducts = products.filter(
    (item) => !mostBoughtProducts.some((mb) => mb.id === item.id)
  );

  // 🔍 FILTERING DEBUGGING
  console.log("🔍 FILTERING PROCESS:", {
    totalProducts: products.length,
    mostBoughtCount: mostBoughtProducts.length,
    mainGridCount: mainGridProducts.length,
    filterLogic:
      "products.filter(item => !mostBoughtProducts.some(mb => mb.id === item.id))",
    filterResult:
      products.length - mostBoughtProducts.length === mainGridProducts.length
        ? "✅ Correct"
        : "❌ Wrong",
  });

  // Show sample of filtered products
  if (mainGridProducts.length > 0) {
    console.log("🔍 MAIN GRID SAMPLE:", {
      firstProduct: {
        id: mainGridProducts[0]?.id,
        name: mainGridProducts[0]?.name,
        hasId: !!mainGridProducts[0]?.id,
      },
      totalInGrid: mainGridProducts.length,
    });
  }

  console.log("🚨 COMPREHENSIVE DEBUG END 🚨");

  // Debug the actual product structure
  if (mainGridProducts.length > 0) {
    console.log("🔍 First product structure:", {
      id: mainGridProducts[0]?.id,
      name: mainGridProducts[0]?.name,
      hasId: !!mainGridProducts[0]?.id,
      productKeys: Object.keys(mainGridProducts[0] || {}),
    });
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 bg-gray-100">
        <View className="space-y-6">
          {/* Quick Access Section - Always shows all products */}
          <QuickAccessSection
            products={allProducts}
            onProductPress={onProductPress}
            selectedProductForQuantity={selectedProductForQuantity}
          />

          {/* Main Products Grid - 4 columns */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              {currentCategory ? `${currentCategory} Products` : "All Products"}{" "}
              ({mainGridProducts.length})
            </Text>

            {/* Debug info */}
            {__DEV__ && (
              <Text className="text-xs text-gray-400 mb-2">
                Debug: {products.length} total, {mainGridProducts.length} in
                grid, {mostBoughtProducts.length} in quick access
              </Text>
            )}

            <View className="flex-row flex-wrap justify-start">
              {mainGridProducts.map((item, index) => (
                <View key={item.id || `product-${index}`} className="w-1/4 p-1">
                  <MemoizedProductCard
                    product={item}
                    onPress={onProductPress}
                    isSelected={selectedProductForQuantity?.id === item.id}
                  />
                </View>
              ))}
            </View>

            {/* Show message if no products in main grid */}
            {mainGridProducts.length === 0 && (
              <View className="py-8 items-center">
                <Text className="text-gray-500 text-center">
                  No products found in this category
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
  // Debug logging
  console.log("🔍 ProductGridContent Debug:", {
    productsLength: products?.length || 0,
    allProductsLength: allProducts?.length || 0,
    currentCategory,
    productsSample: products?.slice(0, 3),
  });

  // More explicit debugging
  console.log("🔍 Products array check:", {
    isArray: Array.isArray(products),
    isNull: products === null,
    isUndefined: products === undefined,
    type: typeof products,
    length: products?.length,
    firstItem: products?.[0],
    firstItemType: typeof products?.[0],
  });

  // Get most bought products (for now, just take first 4 with good stock)
  const mostBoughtProducts = products
    .filter((product) => product.stock > 50) // Good stock availability
    .slice(0, 4);

  console.log("🔍 Most bought products:", {
    count: mostBoughtProducts.length,
    sample: mostBoughtProducts.slice(0, 2).map(p => ({ id: p?.id, name: p?.name, stock: p?.stock })),
  });

  // Filter out most bought products from main grid to avoid duplication
  const mainGridProducts = products.filter(
    (item) => !mostBoughtProducts.some((mb) => mb.id === item.id)
  );

  console.log("🔍 Main grid filtering:", {
    totalProducts: products.length,
    mostBoughtCount: mostBoughtProducts.length,
    mainGridCount: mainGridProducts.length,
    filterResult: products.length - mostBoughtProducts.length === mainGridProducts.length ? "✅ Correct" : "❌ Wrong",
  });

  console.log("🔍 ProductGridContent Processing:", {
    mostBoughtCount: mostBoughtProducts.length,
    mainGridCount: mainGridProducts.length,
    mainGridSample: mainGridProducts?.slice(0, 3),
  });

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
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="p-4">
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
              {mainGridProducts.map((item) => (
                <View key={item.id} className="w-1/4 p-1">
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

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
  // Get most bought products (for now, just take first 4 with good stock)
  const mostBoughtProducts = products
    .filter((product) => product.stock > 50) // Good stock availability
    .slice(0, 4);

  // Filter out most bought products from main grid to avoid duplication
  const mainGridProducts = products.filter(
    (item) => !mostBoughtProducts.some((mb) => mb.id === item.id)
  );

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

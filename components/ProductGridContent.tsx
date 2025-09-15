import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProductCard from "./ProductCard";
import QuickAccessSection from "./QuickAccessSection";
import type { Product, ProductGridContentProps } from "../types/components";
import {
  getMostBoughtProducts,
  getMainGridProducts,
} from "../utils/productHelpers";

// Memoized ProductCard to prevent unnecessary re-renders
const MemoizedProductCard = React.memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if these critical props actually changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.sell_price === nextProps.product.sell_price &&
    prevProps.product.buy_price === nextProps.product.buy_price
  );
});

export default function ProductGridContent({
  products,
  allProducts,
  onProductPress,
  selectedProductForQuantity,
  currentCategory,
  loading = false, // Add loading prop
}: ProductGridContentProps & { loading?: boolean }) {
  // Component logic starts here

  // Use our clean helpers for product filtering
  const mostBoughtProducts = getMostBoughtProducts(products, 4, 50);
  const mainGridProducts = getMainGridProducts(products, mostBoughtProducts);

  // Don't show "no products" message while loading
  if (loading) {
    return null; // Let parent handle loading state
  }

  return (
    <ScrollView
      className="flex-1 bg-background-light dark:bg-background-dark"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 bg-background-light dark:bg-background-dark">
        <View className="space-y-6">
          {/* Quick Access Section - Always shows all products */}
          <QuickAccessSection
            products={allProducts}
            onProductPress={onProductPress}
            selectedProductForQuantity={selectedProductForQuantity}
          />

          {/* Main Products Grid - 4 columns */}
          <View>
            <Text className="text-sm font-semibold text-text-primary dark:text-text-inverse mb-3">
              {currentCategory ? `${currentCategory} Products` : "All Products"}{" "}
              ({mainGridProducts.length})
            </Text>

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
                <Text className="text-text-secondary dark:text-text-muted text-center text-sm">
                  {currentCategory
                    ? `No products found in ${currentCategory}`
                    : "No products available"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

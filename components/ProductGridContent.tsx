import React from "react";
import { View, Text, ScrollView } from "react-native";
import ProductCard from "./ProductCard";
import QuickAccessSection from "./QuickAccessSection";
import type { Product } from "../types/database";
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
  // Component logic starts here

  // Use our clean helpers for product filtering
  const mostBoughtProducts = getMostBoughtProducts(products, 4, 50);
  const mainGridProducts = getMainGridProducts(products, mostBoughtProducts);

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

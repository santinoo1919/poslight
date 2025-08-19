import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import ProductCard from "./ProductCard";
import React from "react";

export default function ProductGrid({
  onProductPress,
  products,
  loading,
  error,
  onRefresh,
  selectedProductForQuantity, // New prop for highlighting selected product
}) {
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-gray-500 text-lg mb-2">Loading products...</Text>
        <Text className="text-gray-400 text-sm">Initializing TinyBase</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-red-500 text-lg mb-2">
          Error loading products
        </Text>
        <Text className="text-gray-400 text-sm mb-4">{error}</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-md"
          onPress={onRefresh}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get most bought products (for now, just take first 4 with good stock)
  const mostBoughtProducts = products
    .filter((product) => product.stock > 50) // Good stock availability
    .slice(0, 4);

  return (
    <View className="flex-1">
      {/* Products Header with Count */}
      <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-gray-800">
            Products ({products.length})
          </Text>
          <View className="flex-row items-center space-x-2">
            <Text className="text-blue-600 text-xs">⚡ TinyBase</Text>
            <Text className="text-sm text-gray-500">
              {products.length} items
            </Text>
          </View>
        </View>
      </View>

      {/* Product Grid - Scrollable */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {products.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg mb-2">
                No products found
              </Text>
              <Text className="text-gray-400 text-sm">
                Try selecting a different category or search term
              </Text>
            </View>
          ) : (
            <View className="space-y-6">
              {/* Most Bought Section - Quick Access */}
              <View>
                <Text className="text-sm font-semibold text-blue-800 mb-3">
                  🚀 Most Bought - Quick Access
                </Text>
                <View className="flex-row flex-wrap justify-start">
                  {mostBoughtProducts.map((item) => (
                    <View key={item.id} className="w-1/4 p-1">
                      <ProductCard
                        product={item}
                        onPress={onProductPress}
                        isSelected={selectedProductForQuantity?.id === item.id}
                      />
                    </View>
                  ))}
                </View>
              </View>

              {/* All Products Grid - 4 columns */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-3">
                  All Products ({products.length - mostBoughtProducts.length})
                </Text>
                <View className="flex-row flex-wrap justify-start">
                  {products
                    .filter(
                      (item) =>
                        !mostBoughtProducts.some((mb) => mb.id === item.id)
                    )
                    .map((item) => (
                      <View key={item.id} className="w-1/4 p-1">
                        <ProductCard
                          product={item}
                          onPress={onProductPress}
                          isSelected={
                            selectedProductForQuantity?.id === item.id
                          }
                        />
                      </View>
                    ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

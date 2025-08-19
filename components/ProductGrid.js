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

      {/* Product Grid - 4 columns, scrollable */}
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
            <View className="flex-row flex-wrap justify-start">
              {products.map((item) => (
                <View key={item.id} className="w-1/4 p-1">
                  <ProductCard product={item} onPress={onProductPress} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

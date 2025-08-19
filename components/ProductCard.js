import { View, Text, TouchableOpacity, Platform } from "react-native";

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity
      className="bg-white rounded-lg border border-gray-200 p-3 flex-1"
      onPress={() => onPress(product)}
      activeOpacity={Platform.OS === "ios" ? 0.7 : 1}
    >
      {/* Category Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: product.color || "#3B82F6" }}
        >
          <Text className="text-white text-xs font-medium">
            {product.icon || "📦"}
          </Text>
        </View>
        <Text className="text-xs text-gray-400">#{product.id}</Text>
      </View>

      {/* Product Image Placeholder */}
      <View className="h-16 bg-gray-100 rounded-md mb-2 items-center justify-center">
        <Text className="text-gray-500 text-xl">📦</Text>
      </View>

      {/* Product Name */}
      <Text
        className="font-semibold text-gray-800 text-sm mb-1"
        numberOfLines={2}
      >
        {product.name}
      </Text>

      {/* Price */}
      <Text className="text-green-600 font-bold text-base mb-1">
        €{product.price.toFixed(2)}
      </Text>

      {/* Stock */}
      <Text className="text-gray-500 text-xs">Stock: {product.stock}</Text>
    </TouchableOpacity>
  );
}

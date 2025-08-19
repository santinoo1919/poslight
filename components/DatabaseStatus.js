import { View, Text } from "react-native";

export default function DatabaseStatus({ productCount, categoryCount }) {
  return (
    <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-blue-600 text-lg mr-2">⚡</Text>
          <Text className="text-blue-800 font-medium">TinyBase Active</Text>
        </View>
        <View className="flex-row space-x-4">
          <View className="items-center">
            <Text className="text-blue-600 text-sm font-semibold">
              {productCount}
            </Text>
            <Text className="text-blue-600 text-xs">Products</Text>
          </View>
          <View className="items-center">
            <Text className="text-blue-600 text-sm font-semibold">
              {categoryCount}
            </Text>
            <Text className="text-blue-600 text-xs">Categories</Text>
          </View>
        </View>
      </View>
      <Text className="text-blue-600 text-xs mt-2">
        Super fast in-memory database • 10KB bundle • Instant operations
      </Text>
    </View>
  );
}

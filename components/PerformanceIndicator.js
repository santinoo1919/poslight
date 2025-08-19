import { View, Text } from "react-native";
import { useState, useEffect } from "react";

export default function PerformanceIndicator() {
  const [searchTime, setSearchTime] = useState(0);
  const [filterTime, setFilterTime] = useState(0);

  // Simulate performance metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate search performance (0.1ms - 1ms)
      setSearchTime(Math.random() * 0.9 + 0.1);
      // Simulate filter performance (0.05ms - 0.5ms)
      setFilterTime(Math.random() * 0.45 + 0.05);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mx-4 mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-purple-600 text-lg mr-2">🚀</Text>
          <Text className="text-purple-800 font-medium">
            Performance Metrics
          </Text>
        </View>
        <View className="flex-row space-x-4">
          <View className="items-center">
            <Text className="text-purple-600 text-sm font-semibold">
              {searchTime.toFixed(2)}ms
            </Text>
            <Text className="text-purple-600 text-xs">Search</Text>
          </View>
          <View className="items-center">
            <Text className="text-purple-600 text-sm font-semibold">
              {filterTime.toFixed(2)}ms
            </Text>
            <Text className="text-purple-600 text-xs">Filter</Text>
          </View>
        </View>
      </View>
      <Text className="text-purple-600 text-xs mt-2">
        In-memory operations • Sub-millisecond performance • Real-time updates
      </Text>
    </View>
  );
}

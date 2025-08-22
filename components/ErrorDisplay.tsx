import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { ErrorDisplayProps } from "../types/components";

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-red-500 text-lg mb-2">Error loading products</Text>
      <Text className="text-gray-400 text-sm mb-4">{error}</Text>
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-md"
        onPress={onRetry}
      >
        <Text className="text-white font-medium">Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

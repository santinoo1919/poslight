import React from "react";
import { View, Text } from "react-native";

// Toast configuration with theme support
export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="bg-green-50 dark:bg-gray-800 border-l-4 border-green-500 dark:border-green-400 rounded-lg p-4 mb-2 mx-4">
      <Text className="text-green-800 dark:text-green-200 font-semibold text-base">
        {text1}
      </Text>
      {text2 && (
        <Text className="text-green-600 dark:text-green-300 text-sm mt-1">
          {text2}
        </Text>
      )}
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View className="bg-red-50 dark:bg-gray-800 border-l-4 border-red-500 dark:border-red-400 rounded-lg p-4 mb-2 mx-4">
      <Text className="text-red-800 dark:text-red-200 font-semibold text-base">
        {text1}
      </Text>
      {text2 && (
        <Text className="text-red-600 dark:text-red-300 text-sm mt-1">
          {text2}
        </Text>
      )}
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg p-4 mb-2 mx-4">
      <Text className="text-blue-800 dark:text-blue-200 font-semibold text-base">
        {text1}
      </Text>
      {text2 && (
        <Text className="text-blue-600 dark:text-blue-300 text-sm mt-1">
          {text2}
        </Text>
      )}
    </View>
  ),
  warning: ({ text1, text2 }: any) => (
    <View className="bg-yellow-50 dark:bg-gray-800 border-l-4 border-yellow-500 dark:border-yellow-400 rounded-lg p-4 mb-2 mx-4">
      <Text className="text-yellow-800 dark:text-yellow-200 font-semibold text-base">
        {text1}
      </Text>
      {text2 && (
        <Text className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
          {text2}
        </Text>
      )}
    </View>
  ),
};


import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../stores/themeStore";

// Toast configuration with theme support
export const toastConfig = {
  success: ({ text1, text2 }: any) => {
    const { isDark } = useTheme();
    return (
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#f0fdf4", // bg-gray-800 : bg-green-50
          borderLeftWidth: 4,
          borderLeftColor: isDark ? "#4ade80" : "#22c55e", // border-green-400 : border-green-500
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          marginHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: isDark ? "#bbf7d0" : "#166534", // text-green-200 : text-green-800
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              color: isDark ? "#86efac" : "#16a34a", // text-green-300 : text-green-600
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    );
  },
  error: ({ text1, text2 }: any) => {
    const { isDark } = useTheme();
    return (
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#fef2f2", // bg-gray-800 : bg-red-50
          borderLeftWidth: 4,
          borderLeftColor: isDark ? "#f87171" : "#ef4444", // border-red-400 : border-red-500
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          marginHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: isDark ? "#fecaca" : "#991b1b", // text-red-200 : text-red-800
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              color: isDark ? "#fca5a5" : "#dc2626", // text-red-300 : text-red-600
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    );
  },
  info: ({ text1, text2 }: any) => {
    const { isDark } = useTheme();
    return (
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#eff6ff", // bg-gray-800 : bg-blue-50
          borderLeftWidth: 4,
          borderLeftColor: isDark ? "#60a5fa" : "#3b82f6", // border-blue-400 : border-blue-500
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          marginHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: isDark ? "#bfdbfe" : "#1e40af", // text-blue-200 : text-blue-800
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              color: isDark ? "#93c5fd" : "#2563eb", // text-blue-300 : text-blue-600
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    );
  },
  warning: ({ text1, text2 }: any) => {
    const { isDark } = useTheme();
    return (
      <View
        style={{
          backgroundColor: isDark ? "#1f2937" : "#fffbeb", // bg-gray-800 : bg-yellow-50
          borderLeftWidth: 4,
          borderLeftColor: isDark ? "#fbbf24" : "#eab308", // border-yellow-400 : border-yellow-500
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
          marginHorizontal: 16,
        }}
      >
        <Text
          style={{
            color: isDark ? "#fef3c7" : "#92400e", // text-yellow-200 : text-yellow-800
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {text1}
        </Text>
        {text2 && (
          <Text
            style={{
              color: isDark ? "#fde68a" : "#d97706", // text-yellow-300 : text-yellow-600
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {text2}
          </Text>
        )}
      </View>
    );
  },
};

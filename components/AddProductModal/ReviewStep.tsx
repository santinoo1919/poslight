import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../stores/themeStore";
import type { StepComponentProps } from "./types";

export default function ReviewStep({ formData }: StepComponentProps) {
  const { isDark } = useTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="space-y-4">
        <Text
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          Review & Confirm
        </Text>

        <View
          className={`p-4 rounded-lg ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
        >
          <Text
            className={`text-base font-semibold mb-2 ${
              isDark ? "text-text-inverse" : "text-text-primary"
            }`}
          >
            {formData.name || "Product Name"}
          </Text>

          <View className="space-y-2">
            <Text
              className={`text-sm ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              Category: {formData.categoryName || "Not selected"}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              SKU: {formData.sku || "Not provided"}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              Price: ${formData.price || "0.00"}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              Stock: {formData.initialStock || "0"} units
            </Text>
          </View>
        </View>

        <View
          className={`p-4 rounded-lg ${isDark ? "bg-blue-900/20" : "bg-blue-50"}`}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="information-circle"
              size={20}
              color={isDark ? "#60A5FA" : "#3B82F6"}
            />
            <Text
              className={`text-sm font-medium ml-2 ${
                isDark ? "text-blue-300" : "text-blue-700"
              }`}
            >
              Ready to Add
            </Text>
          </View>
          <Text
            className={`text-sm ${isDark ? "text-blue-200" : "text-blue-600"}`}
          >
            This product will be added to your inventory and available for sales
            immediately.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

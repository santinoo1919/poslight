import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useTheme } from "../../stores/themeStore";
import type { StepComponentProps } from "./types";

export default function ProductDetailsStep({
  formData,
  onUpdate,
}: StepComponentProps) {
  const { isDark } = useTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="space-y-4">
        <Text
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          Product Details
        </Text>

        <View className="space-y-4">
          {/* Product Name */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Product Name *
            </Text>
            <TextInput
              value={formData.name}
              onChangeText={(value) => onUpdate("name", value)}
              placeholder="Enter product name"
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-surface-dark border-surface-dark text-text-inverse"
                  : "bg-surface-light border-surface-light text-text-primary"
              }`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>

          {/* Description */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Description
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(value) => onUpdate("description", value)}
              placeholder="Enter product description"
              multiline
              numberOfLines={3}
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-surface-dark border-surface-dark text-text-inverse"
                  : "bg-surface-light border-surface-light text-text-primary"
              }`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>

          {/* SKU */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              SKU *
            </Text>
            <TextInput
              value={formData.sku}
              onChangeText={(value) => onUpdate("sku", value)}
              placeholder="Enter SKU"
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-surface-dark border-surface-dark text-text-inverse"
                  : "bg-surface-light border-surface-light text-text-primary"
              }`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>

          {/* Barcode */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Barcode
            </Text>
            <TextInput
              value={formData.barcode}
              onChangeText={(value) => onUpdate("barcode", value)}
              placeholder="Enter barcode"
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-surface-dark border-surface-dark text-text-inverse"
                  : "bg-surface-light border-surface-light text-text-primary"
              }`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>

          {/* Brand */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Brand
            </Text>
            <TextInput
              value={formData.brand}
              onChangeText={(value) => onUpdate("brand", value)}
              placeholder="Enter brand name"
              className={`p-3 rounded-lg border ${
                isDark
                  ? "bg-surface-dark border-surface-dark text-text-inverse"
                  : "bg-surface-light border-surface-light text-text-primary"
              }`}
              placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

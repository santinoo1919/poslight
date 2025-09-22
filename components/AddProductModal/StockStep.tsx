import React from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { useTheme } from "../../stores/themeStore";
import type { StepComponentProps } from "./types";

export default function StockStep({ formData, onUpdate }: StepComponentProps) {
  const { isDark } = useTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="space-y-4">
        <Text
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          Pricing & Stock
        </Text>

        <View className="space-y-4">
          {/* Selling Price */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Selling Price *
            </Text>
            <View className="flex-row items-center">
              <Text
                className={`text-lg mr-2 ${
                  isDark ? "text-text-inverse" : "text-text-primary"
                }`}
              >
                $
              </Text>
              <TextInput
                value={formData.price}
                onChangeText={(value) => onUpdate("price", value)}
                placeholder="0.00"
                keyboardType="numeric"
                className={`flex-1 p-3 rounded-lg border ${
                  isDark
                    ? "bg-surface-dark border-surface-dark text-text-inverse"
                    : "bg-surface-light border-surface-light text-text-primary"
                }`}
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              />
            </View>
          </View>

          {/* Cost Price */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Cost Price
            </Text>
            <View className="flex-row items-center">
              <Text
                className={`text-lg mr-2 ${
                  isDark ? "text-text-inverse" : "text-text-primary"
                }`}
              >
                $
              </Text>
              <TextInput
                value={formData.cost}
                onChangeText={(value) => onUpdate("cost", value)}
                placeholder="0.00"
                keyboardType="numeric"
                className={`flex-1 p-3 rounded-lg border ${
                  isDark
                    ? "bg-surface-dark border-surface-dark text-text-inverse"
                    : "bg-surface-light border-surface-light text-text-primary"
                }`}
                placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
              />
            </View>
          </View>

          {/* Initial Stock */}
          <View>
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Initial Stock *
            </Text>
            <TextInput
              value={formData.initialStock}
              onChangeText={(value) => onUpdate("initialStock", value)}
              placeholder="Enter quantity"
              keyboardType="numeric"
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

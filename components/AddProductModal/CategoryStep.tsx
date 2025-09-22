import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../stores/themeStore";
import { SAMPLE_CATEGORIES } from "./constants";
import type { StepComponentProps } from "./types";

export default function CategoryStep({
  formData,
  onUpdate,
}: StepComponentProps) {
  const { isDark } = useTheme();

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    onUpdate("categoryId", categoryId);
    onUpdate("categoryName", categoryName);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="space-y-4">
        <Text
          className={`text-lg font-semibold mb-4 ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          Select Category
        </Text>

        {/* Existing Categories */}
        <View className="space-y-3">
          {SAMPLE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategorySelect(category.id, category.name)}
              className={`p-4 rounded-lg border-2 ${
                formData.categoryId === category.id
                  ? "border-brand-primary"
                  : isDark
                    ? "border-surface-dark"
                    : "border-surface-light"
              } ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
            >
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: category.color }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={20}
                    color="white"
                  />
                </View>
                <Text
                  className={`text-base font-medium ${
                    isDark ? "text-text-inverse" : "text-text-primary"
                  }`}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Create New Category */}
        <TouchableOpacity
          className={`p-4 rounded-lg border-2 border-dashed ${
            isDark ? "border-text-muted" : "border-text-secondary"
          } ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
            <Text
              className={`text-base font-medium ml-3 ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              Create New Category
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

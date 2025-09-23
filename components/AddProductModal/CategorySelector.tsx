import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../stores/themeStore";
import { SAMPLE_CATEGORIES } from "./constants";
import type { Category } from "./types";

interface CategorySelectorProps {
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export default function CategorySelector({
  selectedCategories,
  onCategoriesChange,
}: CategorySelectorProps) {
  const { isDark } = useTheme();
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAddCategory = (category: Category) => {
    // Check if category is already selected
    const isAlreadySelected = selectedCategories.some(
      (cat) => cat.id === category.id
    );

    if (!isAlreadySelected) {
      onCategoriesChange([...selectedCategories, category]);
    }
    setShowCategoryModal(false);
  };

  const handleRemoveCategory = (categoryId: string) => {
    onCategoriesChange(
      selectedCategories.filter((cat) => cat.id !== categoryId)
    );
  };

  const availableCategories = SAMPLE_CATEGORIES.filter(
    (category) => !selectedCategories.some((cat) => cat.id === category.id)
  );

  return (
    <View>
      <Text
        className={`text-sm font-medium mb-2 ${
          isDark ? "text-text-inverse" : "text-text-primary"
        }`}
      >
        Categories
      </Text>

      {/* Selected Categories */}
      <View className="flex-row flex-wrap gap-2 mb-3">
        {selectedCategories.map((category) => (
          <View
            key={category.id}
            className={`flex-row items-center px-3 py-2 rounded-lg border ${
              isDark
                ? "bg-surface-dark border-border-dark"
                : "bg-surface-light border-border-light"
            }`}
          >
            <View
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: category.color }}
            />
            <Text
              className={`text-sm ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              {category.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveCategory(category.id)}
              className="ml-2"
            >
              <Ionicons
                name="close-circle"
                size={16}
                color={isDark ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Category Button */}
      <TouchableOpacity
        onPress={() => setShowCategoryModal(true)}
        className={`flex-row items-center justify-center p-3 rounded-lg border-2 border-dashed ${
          isDark ? "border-text-muted" : "border-text-secondary"
        } ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
      >
        <Ionicons
          name="add-circle-outline"
          size={20}
          color={isDark ? "#9ca3af" : "#6b7280"}
        />
        <Text
          className={`text-sm font-medium ml-2 ${
            isDark ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          Add Category
        </Text>
      </TouchableOpacity>

      {/* Category Selection Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View
          className={`flex-1 ${
            isDark ? "bg-background-dark" : "bg-background-light"
          }`}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
            <Text
              className={`text-lg font-semibold ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Select Category
            </Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Categories List */}
          <ScrollView className="flex-1 p-4">
            <View className="space-y-3">
              {availableCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleAddCategory(category)}
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? "bg-surface-dark border-border-dark"
                      : "bg-surface-light border-border-light"
                  }`}
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
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

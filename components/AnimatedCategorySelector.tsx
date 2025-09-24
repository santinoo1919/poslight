import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";

interface Category {
  key: string;
  name: string;
  icon: string;
}

interface CategorySelectorProps {
  categories: Category[];
  currentCategory: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
}

export default function CategorySelector({
  categories,
  currentCategory,
  onCategorySelect,
}: CategorySelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="flex-row"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {/* Show All option */}
      <Pressable
        className={`mr-3 px-3 py-2 rounded-full ${
          currentCategory === null
            ? "bg-blue-100 border border-blue-200"
            : "bg-transparent"
        }`}
        onPress={() => onCategorySelect(null)}
      >
        <Text
          className={`text-sm font-medium ${
            currentCategory === null ? "text-blue-600" : "text-slate-500"
          }`}
        >
          📦 Show All
        </Text>
      </Pressable>

      {/* Categories */}
      {categories.map((category) => (
        <Pressable
          key={category.name}
          className={`mr-3 px-3 py-2 rounded-full ${
            currentCategory === category.key
              ? "bg-blue-100 border border-blue-200"
              : "bg-transparent"
          }`}
          onPress={() => onCategorySelect(category.key)}
        >
          <Text
            className={`text-sm ${
              currentCategory === category.key
                ? "text-blue-600 font-medium"
                : "text-slate-500"
            }`}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

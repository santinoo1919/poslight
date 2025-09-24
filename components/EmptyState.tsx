// components/EmptyState.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";
import { useProductStore } from "../stores/productStore";
import AddProductModal from "./AddProductModal";

interface EmptyStateProps {
  onAddProducts: () => void;
}

export default function EmptyState({ onAddProducts }: EmptyStateProps) {
  const { isDark } = useTheme();
  const { refreshProducts, clearAllData } = useProductStore();
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddProducts = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleProductSubmit = () => {
    // Refresh the product list to show the new product
    refreshProducts();

    // Close the modal
    setModalVisible(false);

    // Call the parent callback to trigger any additional actions
    onAddProducts();
  };

  return (
    <>
      <View className="flex-1 items-center justify-center px-6">
        {/* Icon */}
        <View className="mb-6">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center ${
              isDark ? "bg-background-dark" : "bg-background-light"
            } border-2 ${isDark ? "border-border-dark" : "border-border-light"}`}
          >
            <Ionicons
              name="cube-outline"
              size={40}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </View>
        </View>

        {/* Title */}
        <Text
          className={`text-2xl font-bold mb-3 text-center ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          No Products Yet
        </Text>

        {/* Description */}
        <Text
          className={`text-base text-center mb-8 leading-6 ${
            isDark ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          Get started by adding your first products to your inventory. You can
          add products with prices, stock levels, and categories.
        </Text>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleAddProducts}
          className={`px-8 py-4 rounded-lg ${
            isDark ? "bg-brand-primaryDark" : "bg-brand-primary"
          } shadow-sm`}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center">
            <Ionicons
              name="add-circle"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-base">
              Add Products
            </Text>
          </View>
        </TouchableOpacity>

        {/* Help Text */}
        <Text
          className={`text-sm text-center mt-6 ${
            isDark ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          You can add products manually or import from a file
        </Text>
      </View>

      {/* Add Product Modal */}
      <AddProductModal
        visible={modalVisible}
        onClose={handleModalClose}
        onProductAdded={handleProductSubmit}
      />
    </>
  );
}

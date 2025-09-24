import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import AddProductModal from "./AddProductModal";
import type { ProductGridHeaderProps } from "../types/components";
import { useTheme } from "../stores/themeStore";
import { useProductStore } from "../stores/productStore";

export default function ProductGridHeader({
  visibleProductsCount,
  totalProductsCount,
  currentCategory,
  onSearch,
}: ProductGridHeaderProps) {
  const { isDark } = useTheme();
  const { refreshProducts } = useProductStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Determine the title based on whether a category is selected
  const title = currentCategory || "All Products";

  const handleAddProduct = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleProductSubmit = () => {
    refreshProducts();
    setModalVisible(false);
  };

  return (
    <>
      <View
        className={`px-4 py-3 border-b ${isDark ? "border-border-dark bg-background-dark" : "border-border-light bg-background-light"}`}
      >
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-lg font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"}`}
          >
            {title} ({visibleProductsCount})
          </Text>
          <View className="flex-row items-center space-x-4 gap-4">
            {onSearch && (
              <View className="flex-shrink-0">
                <SearchBar onSearch={onSearch} />
              </View>
            )}
            <TouchableOpacity
              onPress={handleAddProduct}
              className={`p-2 rounded-lg ${isDark ? "bg-brand-primaryDark" : "bg-brand-primary"}`}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
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

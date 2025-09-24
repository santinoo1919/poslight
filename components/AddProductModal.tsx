import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";
import { db } from "../services/tinybaseStore";

interface SimpleAddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function SimpleAddProductModal({
  visible,
  onClose,
  onProductAdded,
}: SimpleAddProductModalProps) {
  const { isDark } = useTheme();

  // Simple form state
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState("");

  const resetForm = () => {
    setName("");
    setSku("");
    setSellPrice("");
    setBuyPrice("");
    setStock("");
    setCategory("");
    setBrand("");
    setBarcode("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    // Simple validation
    if (!name.trim() || !sku.trim() || !sellPrice.trim() || !stock.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const sellPriceNum = parseFloat(sellPrice);
    const buyPriceNum = buyPrice ? parseFloat(buyPrice) : 0;
    const stockNum = parseInt(stock);

    if (isNaN(sellPriceNum) || sellPriceNum <= 0) {
      Alert.alert("Error", "Please enter a valid sell price.");
      return;
    }

    if (buyPrice && (isNaN(buyPriceNum) || buyPriceNum < 0)) {
      Alert.alert("Error", "Please enter a valid buy price.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert("Error", "Please enter a valid stock quantity.");
      return;
    }

    try {
      // Add product to database
      const productId = db.addProduct({
        name: name.trim(),
        description: "", // No description for now
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        brand: brand.trim() || undefined,
        category: category.trim() || "General",
        price: sellPriceNum,
        cost: buyPriceNum,
        initialStock: stockNum,
      });

      console.log("Product created with ID:", productId);

      // Reset form and close
      resetForm();
      onProductAdded();
      onClose();

      Alert.alert("Success", "Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      Alert.alert("Error", "Failed to add product. Please try again.");
    }
  };

  const inputStyle = `p-4 rounded-lg border text-base ${
    isDark
      ? "bg-surface-dark border-border-dark text-text-inverse"
      : "bg-surface-light border-border-light text-text-primary"
  }`;

  const labelStyle = `text-sm font-medium mb-2 ${
    isDark ? "text-text-inverse" : "text-text-primary"
  }`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className={`flex-1 p-8 ${
            isDark ? "bg-background-dark" : "bg-background-light"
          }`}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 ">
            <Text
              className={`text-lg font-semibold ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Add Product
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <ScrollView
            className="flex-1 p-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="space-y-4">
              {/* Product Name and SKU Row */}
              <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                  <Text className={labelStyle}>Product Name *</Text>
                  <TextInput
                    className={inputStyle}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter product name"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>SKU *</Text>
                  <TextInput
                    className={inputStyle}
                    value={sku}
                    onChangeText={setSku}
                    placeholder="Enter SKU"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
              </View>

              {/* Sell Price and Buy Price Row */}
              <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                  <Text className={labelStyle}>Sell Price *</Text>
                  <TextInput
                    className={inputStyle}
                    value={sellPrice}
                    onChangeText={setSellPrice}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>Buy Price</Text>
                  <TextInput
                    className={inputStyle}
                    value={buyPrice}
                    onChangeText={setBuyPrice}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
              </View>

              {/* Stock */}
              <View className="mb-8">
                <Text className={labelStyle}>Stock *</Text>
                <TextInput
                  className={inputStyle}
                  value={stock}
                  onChangeText={setStock}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                />
              </View>

              {/* Category and Brand Row */}
              <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                  <Text className={labelStyle}>Category</Text>
                  <TextInput
                    className={inputStyle}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g., Electronics"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>Brand</Text>
                  <TextInput
                    className={inputStyle}
                    value={brand}
                    onChangeText={setBrand}
                    placeholder="Brand name"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
              </View>

              {/* Barcode */}
              <View>
                <Text className={labelStyle}>Barcode</Text>
                <TextInput
                  className={inputStyle}
                  value={barcode}
                  onChangeText={setBarcode}
                  placeholder="Barcode (optional)"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-4 ">
            <TouchableOpacity
              onPress={handleSubmit}
              className={`p-4 rounded-lg ${
                isDark ? "bg-brand-primaryDark" : "bg-brand-primary"
              }`}
            >
              <Text className="text-white text-center font-semibold text-base">
                Add Product
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

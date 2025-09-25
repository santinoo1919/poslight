import React, { useState, useEffect } from "react";
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
import {
  generateSimpleSKU,
  validateSKU,
  checkSKUUniqueness,
} from "../utils/skuGenerator";
import {
  validateAddProductInput,
  formatValidationErrors,
} from "../utils/validation";

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
  const [size, setSize] = useState("");
  const [skuValidation, setSkuValidation] = useState({
    isValid: true,
    message: "",
  });

  const resetForm = () => {
    setName("");
    setSku("");
    setSellPrice("");
    setBuyPrice("");
    setStock("");
    setCategory("");
    setBrand("");
    setBarcode("");
    setSize("");
    setSkuValidation({ isValid: true, message: "" });
  };

  // Auto-generate SKU when name, category, or size changes
  useEffect(() => {
    if (name && category) {
      const generatedSKU = generateSimpleSKU({
        name,
        category,
        size: size || undefined,
      });
      setSku(generatedSKU);
    }
  }, [name, category, size]);

  // Validate SKU when it changes
  useEffect(() => {
    if (sku) {
      const validation = validateSKU(sku);
      setSkuValidation(validation);
    }
  }, [sku]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    // Check SKU validation
    if (!skuValidation.isValid) {
      Alert.alert("Error", `Invalid SKU: ${skuValidation.message}`);
      return;
    }

    // Check for duplicate SKU
    const existingProducts = db.getProducts();
    const existingSKUs = existingProducts.map((p) => p.sku);
    if (!checkSKUUniqueness(sku, existingSKUs)) {
      Alert.alert(
        "Error",
        "SKU already exists. Please choose a different one."
      );
      return;
    }

    // Parse numeric values
    const sellPriceNum = parseFloat(sellPrice);
    const buyPriceNum = parseFloat(buyPrice);
    const stockNum = parseInt(stock);

    // Validate using Zod schema
    const validationResult = validateAddProductInput({
      name: name.trim(),
      sku: sku.trim(),
      sellPrice: sellPriceNum,
      buyPrice: buyPriceNum,
      stock: stockNum,
      category: category.trim(),
      brand: brand.trim() || undefined,
      barcode: barcode.trim() || undefined,
      description: "", // Description field not implemented yet
      size: size.trim() || undefined,
    });

    if (!validationResult.success) {
      const errorMessage = formatValidationErrors(
        validationResult.error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        )
      );
      Alert.alert("Validation Error", errorMessage);
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
              {/* Product Name and Size Row */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className={labelStyle}>Product Name *</Text>
                  <TextInput
                    className={inputStyle}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Red Onions"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>Size</Text>
                  <TextInput
                    className={inputStyle}
                    value={size}
                    onChangeText={setSize}
                    placeholder="e.g., 5LB, 12OZ"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
              </View>

              {/* Category and SKU Row */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className={labelStyle}>Category *</Text>
                  <TextInput
                    className={inputStyle}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="e.g., Produce"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>SKU (Auto-generated)</Text>
                  <TextInput
                    className={`${inputStyle} ${!skuValidation.isValid ? "border-red-500" : ""} ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                    value={sku}
                    editable={false}
                    placeholder="e.g., PRO-ONION-5LB"
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  />
                  {sku && !skuValidation.isValid && (
                    <Text className="text-red-500 text-xs mt-1">
                      {skuValidation.message}
                    </Text>
                  )}
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
                  <Text className={labelStyle}>Buy Price *</Text>
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

              {/* Brand */}
              <View className="mb-8">
                <Text className={labelStyle}>Brand</Text>
                <TextInput
                  className={inputStyle}
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="Brand name"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                />
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

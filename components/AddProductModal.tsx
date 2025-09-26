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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "../stores/themeStore";
import { db } from "../services/tinybaseStore";
import {
  generateSimpleSKU,
  validateSKU,
  checkSKUUniqueness,
} from "../utils/skuGenerator";
import { AddProductInputSchema } from "../utils/validation";
import type { z } from "zod";

// Input form data (strings before transformation)
type AddProductFormData = {
  name: string;
  sku: string;
  sellPrice: string;
  buyPrice: string;
  stock: string;
  category: string;
  brand?: string;
  barcode?: string;
  description?: string;
  size?: string;
};

// Output data after transformation
type AddProductOutputData = z.infer<typeof AddProductInputSchema>;

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

  // React Hook Form setup
  const form = useForm<AddProductFormData>({
    resolver: zodResolver(AddProductInputSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      name: "",
      sku: "",
      sellPrice: "",
      buyPrice: "",
      stock: "",
      category: "",
      brand: "",
      barcode: "",
      description: "",
      size: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = form;
  const [skuValidation, setSkuValidation] = useState({
    isValid: true,
    message: "",
  });

  // Watch form values for SKU generation
  const watchedName = watch("name");
  const watchedCategory = watch("category");
  const watchedSize = watch("size");
  const watchedSku = watch("sku");
  const watchedSellPrice = watch("sellPrice");
  const watchedBuyPrice = watch("buyPrice");

  // Auto-generate SKU when name, category, or size changes
  useEffect(() => {
    if (watchedName && watchedCategory) {
      const generatedSKU = generateSimpleSKU({
        name: watchedName,
        category: watchedCategory,
        size: watchedSize || undefined,
      });
      setValue("sku", generatedSKU);
    }
  }, [watchedName, watchedCategory, watchedSize, setValue]);

  // Validate SKU when it changes
  useEffect(() => {
    if (watchedSku) {
      const validation = validateSKU(watchedSku);
      setSkuValidation(validation);
    }
  }, [watchedSku]);

  // Trigger cross-field validation when prices change
  useEffect(() => {
    if (watchedSellPrice && watchedBuyPrice) {
      trigger("buyPrice");
    }
  }, [watchedSellPrice, watchedBuyPrice, trigger]);

  const handleClose = () => {
    reset();
    setSkuValidation({ isValid: true, message: "" });
    onClose();
  };

  const onSubmit = (data: AddProductFormData) => {
    // Check SKU validation
    if (!skuValidation.isValid) {
      Alert.alert("Error", `Invalid SKU: ${skuValidation.message}`);
      return;
    }

    // Check for duplicate SKU
    const existingProducts = db.getProducts();
    const existingSKUs = existingProducts.map((p) => p.sku);
    if (!checkSKUUniqueness(data.sku, existingSKUs)) {
      Alert.alert(
        "Error",
        "SKU already exists. Please choose a different one."
      );
      return;
    }

    try {
      // Data is already validated by the schema, just transform for database
      const productId = db.addProduct({
        name: data.name.trim(),
        description: data.description?.trim() || "",
        sku: data.sku.trim(),
        barcode: data.barcode?.trim() || undefined,
        brand: data.brand?.trim() || undefined,
        category: data.category.trim() || "General",
        price: parseFloat(
          data.sellPrice.replace(/[€$£¥]/g, "").replace(",", ".")
        ),
        cost: parseFloat(
          data.buyPrice.replace(/[€$£¥]/g, "").replace(",", ".")
        ),
        initialStock: parseInt(data.stock),
      });

      // Reset form and close
      reset();
      setSkuValidation({ isValid: true, message: "" });
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
                  <Controller
                    name="name"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                          value={value}
                          onChangeText={onChange}
                          placeholder="e.g., Red Onions"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>Size</Text>
                  <Controller
                    name="size"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                          value={value}
                          onChangeText={onChange}
                          placeholder="e.g., 5LB, 12OZ"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Category and SKU Row */}
              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className={labelStyle}>Category *</Text>
                  <Controller
                    name="category"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                          value={value}
                          onChangeText={onChange}
                          placeholder="e.g., Produce"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>SKU (Auto-generated)</Text>
                  <Controller
                    name="sku"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error || !skuValidation.isValid ? "border-red-500" : ""} ${
                            isDark ? "bg-gray-700" : "bg-gray-100"
                          }`}
                          value={value}
                          editable={false}
                          placeholder="e.g., PRO-ONION-5LB"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {(error || (!skuValidation.isValid && value)) && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error?.message || skuValidation.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Sell Price and Buy Price Row */}
              <View className="flex-row gap-4 mb-8">
                <View className="flex-1">
                  <Text className={labelStyle}>Sell Price *</Text>
                  <Controller
                    name="sellPrice"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                          value={value}
                          onChangeText={onChange}
                          placeholder="0.00"
                          keyboardType="numeric"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
                <View className="flex-1">
                  <Text className={labelStyle}>Buy Price *</Text>
                  <Controller
                    name="buyPrice"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <View>
                        <TextInput
                          className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                          value={value}
                          onChangeText={onChange}
                          placeholder="0.00"
                          keyboardType="numeric"
                          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                        />
                        {error && (
                          <Text className="text-red-500 text-xs mt-1">
                            {error.message}
                          </Text>
                        )}
                      </View>
                    )}
                  />
                </View>
              </View>

              {/* Stock */}
              <View className="mb-8">
                <Text className={labelStyle}>Stock *</Text>
                <Controller
                  name="stock"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                        value={value}
                        onChangeText={onChange}
                        placeholder="0"
                        keyboardType="numeric"
                        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                      />
                      {error && (
                        <Text className="text-red-500 text-xs mt-1">
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Brand */}
              <View className="mb-8">
                <Text className={labelStyle}>Brand</Text>
                <Controller
                  name="brand"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                        value={value}
                        onChangeText={onChange}
                        placeholder="Brand name"
                        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                      />
                      {error && (
                        <Text className="text-red-500 text-xs mt-1">
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* Barcode */}
              <View>
                <Text className={labelStyle}>Barcode</Text>
                <Controller
                  name="barcode"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        className={`${inputStyle} ${error ? "border-red-500" : ""}`}
                        value={value}
                        onChangeText={onChange}
                        placeholder="Barcode (optional)"
                        placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                      />
                      {error && (
                        <Text className="text-red-500 text-xs mt-1">
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="p-4 ">
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !skuValidation.isValid}
              className={`p-4 rounded-lg ${
                !isValid || !skuValidation.isValid
                  ? isDark
                    ? "bg-gray-600"
                    : "bg-gray-400"
                  : isDark
                    ? "bg-brand-primaryDark"
                    : "bg-brand-primary"
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

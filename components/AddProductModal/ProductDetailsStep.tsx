import React from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import InputField from "../common/InputField";
import CategorySelector from "./CategorySelector";
import type { StepComponentProps } from "./types";

export default function ProductDetailsStep({
  formData,
  onUpdate,
}: StepComponentProps) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {/* Two-column layout for main fields */}
          <View className="space-y-4">
            {/* Row 1: Product Name and SKU */}
            <View className="flex-row gap-4">
              <View className="flex-1 mb-8">
                <InputField
                  label="Product Name"
                  required
                  value={formData.name}
                  onChangeText={(value) => onUpdate("name", value)}
                  placeholder="Enter product name"
                />
              </View>
              <View className="flex-1">
                <InputField
                  label="SKU"
                  required
                  value={formData.sku}
                  onChangeText={(value) => onUpdate("sku", value)}
                  placeholder="Enter SKU"
                />
              </View>
            </View>

            {/* Row 2: Barcode and Brand */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1">
                <InputField
                  label="Barcode"
                  value={formData.barcode}
                  onChangeText={(value) => onUpdate("barcode", value)}
                  placeholder="Enter barcode"
                />
              </View>
              <View className="flex-1">
                <InputField
                  label="Brand"
                  value={formData.brand}
                  onChangeText={(value) => onUpdate("brand", value)}
                  placeholder="Enter brand name"
                />
              </View>
            </View>

            {/* Categories Section */}
            <CategorySelector
              selectedCategories={formData.categories}
              onCategoriesChange={(categories) =>
                onUpdate("categories", categories)
              }
            />

            {/* Full-width Description field with increased height */}
            <InputField
              label="Description"
              value={formData.description}
              onChangeText={(value) => onUpdate("description", value)}
              placeholder="Enter product description"
              multiline
              numberOfLines={5}
              inputClassName="min-h-[120px]"
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import InputField from "../common/InputField";
import { useTheme } from "../../stores/themeStore";
import type { StepComponentProps } from "./types";

export default function StockStep({ formData, onUpdate }: StepComponentProps) {
  const { isDark } = useTheme();

  // Calculate profit based on selling price and cost price
  const calculateProfit = () => {
    const sellingPrice = parseFloat(formData.price) || 0;
    const costPrice = parseFloat(formData.cost) || 0;
    return sellingPrice - costPrice;
  };

  const profit = calculateProfit();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          <View className="space-y-4">
            {/* Row 1: Selling Price and Cost Price */}
            <View className="flex-row gap-4 mb-8">
              <View className="flex-1">
                <InputField
                  label="Selling Price"
                  required
                  value={formData.price}
                  onChangeText={(value) => onUpdate("price", value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  showDollarSign
                />
              </View>
              <View className="flex-1">
                <InputField
                  label="Cost Price"
                  value={formData.cost}
                  onChangeText={(value) => onUpdate("cost", value)}
                  placeholder="0.00"
                  keyboardType="numeric"
                  showDollarSign
                />
              </View>
            </View>

            {/* Row 2: Initial Stock and Profit */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputField
                  label="Initial Stock"
                  required
                  value={formData.initialStock}
                  onChangeText={(value) => onUpdate("initialStock", value)}
                  placeholder="Enter quantity"
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <InputField
                  label="Profit"
                  isReadOnly
                  readOnlyValue={profit.toFixed(2)}
                  showDollarSign
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

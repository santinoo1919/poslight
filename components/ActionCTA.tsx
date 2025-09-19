import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../stores/themeStore";

interface ActionCTAProps {
  onPress: () => void;
  totalAmount?: number;
  itemCount: number;
  disabled?: boolean;
  mode: "cart" | "stock";
}

export default function ActionCTA({
  onPress,
  totalAmount,
  itemCount,
  disabled = false,
  mode,
}: ActionCTAProps) {
  const { isDark } = useTheme();
  const isCartMode = mode === "cart";
  const isStockMode = mode === "stock";

  const getButtonText = () => {
    if (isCartMode && totalAmount !== undefined) {
      return `${itemCount} items • €${totalAmount.toFixed(2)}`;
    }
    if (isStockMode) {
      return `${itemCount} items to add`;
    }
    return `${itemCount} items`;
  };

  const getButtonColor = () => {
    if (disabled) return isDark ? "bg-gray-600" : "bg-gray-400";
    if (isCartMode) return isDark ? "bg-green-500" : "bg-green-600";
    if (isStockMode) return isDark ? "bg-blue-500" : "bg-blue-600";
    return isDark ? "bg-gray-500" : "bg-gray-600";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`py-3 px-4 rounded-lg ${getButtonColor()}`}
    >
      <Text className="text-white text-center font-semibold text-lg">
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
}

import React from "react";
import { TouchableOpacity, Text } from "react-native";

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
    if (disabled) return "bg-gray-400 dark:bg-gray-600";
    if (isCartMode) return "bg-green-600 dark:bg-green-500";
    if (isStockMode) return "bg-blue-600 dark:bg-blue-500";
    return "bg-gray-600 dark:bg-gray-500";
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

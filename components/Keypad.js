import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Keypad button component - single responsibility
const KeypadButton = ({
  value,
  onPress,
  variant = "default",
  disabled = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle =
      "w-16 h-16 rounded-lg items-center justify-center mx-2 mb-3";

    switch (variant) {
      case "number":
        return `${baseStyle} bg-gray-100 border border-gray-200`;
      case "function":
        return `${baseStyle} bg-blue-100 border border-blue-200`;
      case "clear":
        return `${baseStyle} bg-red-100 border border-red-200`;
      default:
        return `${baseStyle} bg-gray-100 border border-gray-200`;
    }
  };

  const getTextStyle = () => {
    const baseStyle = "font-bold text-xl";

    switch (variant) {
      case "number":
        return `${baseStyle} text-gray-800`;
      case "function":
        return `${baseStyle} text-blue-700`;
      case "clear":
        return `${baseStyle} text-red-600`;
      default:
        return `${baseStyle} text-gray-800`;
    }
  };

  return (
    <TouchableOpacity
      className={getButtonStyle()}
      onPress={() => onPress(value)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text className={getTextStyle()}>{value}</Text>
    </TouchableOpacity>
  );
};

// Main Keypad component - orchestrates the keypad layout
const Keypad = ({ onNumberPress, onClear, disabled = false }) => {
  const handleNumberPress = (number) => {
    if (onNumberPress && !disabled) {
      onNumberPress(number);
    }
  };

  const handleClear = () => {
    if (onClear && !disabled) {
      onClear();
    }
  };

  return (
    <View className="bg-white border-t border-gray-200 p-4">
      {/* Keypad Header */}
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-700 text-center">
          💰 Quantity Keypad
        </Text>
      </View>

      {/* Keypad Grid */}
      <View className="items-center">
        {/* Row 1: 1, 2, 3 */}
        <View className="flex-row">
          <KeypadButton
            value="1"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="2"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="3"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
        </View>

        {/* Row 2: 4, 5, 6 */}
        <View className="flex-row">
          <KeypadButton
            value="4"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="5"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="6"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
        </View>

        {/* Row 3: 7, 8, 9 */}
        <View className="flex-row">
          <KeypadButton
            value="7"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="8"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
          <KeypadButton
            value="9"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
        </View>

        {/* Row 4: Clear, 0 */}
        <View className="flex-row justify-center">
          <KeypadButton
            value="C"
            variant="clear"
            onPress={handleClear}
            disabled={disabled}
          />
          <KeypadButton
            value="0"
            variant="number"
            onPress={handleNumberPress}
            disabled={disabled}
          />
        </View>
      </View>

      {/* Usage Hint */}
      <View className="mt-3">
        <Text className="text-xs text-gray-500 text-center">
          Select product → Type quantity → Auto-adds to cart
        </Text>
      </View>
    </View>
  );
};

export default Keypad;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type {
  KeypadProps,
  ButtonVariant,
  KeypadButtonProps,
} from "../types/components";

// Keypad button component - single responsibility
const KeypadButton: React.FC<KeypadButtonProps> = ({
  value,
  onPress,
  variant = "default",
  disabled = false,
}) => {
  const getButtonStyle = (): string => {
    const baseStyle =
      "w-16 h-16 rounded-lg items-center justify-center mx-2 mb-3";

    // Keep subtle tints for action buttons, neutral for numbers
    switch (variant) {
      case "number":
        return `${baseStyle} bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark`;
      case "function":
        return `${baseStyle} bg-blue-50 dark:bg-blue-900 bg-opacity-30 dark:bg-opacity-30 border border-blue-200 dark:border-blue-700`;
      case "clear":
        return `${baseStyle} bg-red-50 dark:bg-red-900 bg-opacity-30 dark:bg-opacity-30 border border-red-200 dark:border-red-700`;
      default:
        return `${baseStyle} bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark`;
    }
  };

  const getTextStyle = (): string => {
    const baseStyle = "font-bold text-xl";

    // Match text colors to button tints
    switch (variant) {
      case "number":
        return `${baseStyle} text-text-primary dark:text-text-inverse`;
      case "function":
        return `${baseStyle} text-blue-700 dark:text-blue-300`;
      case "clear":
        return `${baseStyle} text-red-700 dark:text-red-300`;
      default:
        return `${baseStyle} text-text-primary dark:text-text-inverse`;
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
const Keypad: React.FC<KeypadProps> = React.memo(
  ({ onNumberPress, onDelete, onClear, onEnter, disabled = false }) => {
    const handleNumberPress = (number: string) => {
      if (onNumberPress && !disabled) {
        onNumberPress(number);
      }
    };

    const handleClear = () => {
      if (onClear && !disabled) {
        onClear();
      }
    };

    const handleDelete = () => {
      if (onDelete && !disabled) {
        onDelete();
      }
    };

    const handleEnter = () => {
      if (onEnter && !disabled) {
        onEnter();
      }
    };

    return (
      <View className="bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark p-4">
        {/* Keypad Header */}
        <View className="mb-3">
          <Text className="text-sm font-medium text-text-primary dark:text-text-inverse text-center">
            💰 Quantity Keypad
          </Text>
          <View className="mt-3">
            <Text className="text-xs text-text-secondary dark:text-text-muted text-center">
              Select product → Type quantity → Auto-adds to cart
            </Text>
          </View>
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

          {/* Row 4: Delete, 0, Enter */}
          <View className="flex-row justify-center">
            <KeypadButton
              value="⌫"
              variant="function"
              onPress={handleDelete}
              disabled={disabled}
            />
            <KeypadButton
              value="0"
              variant="number"
              onPress={handleNumberPress}
              disabled={disabled}
            />
            <KeypadButton
              value="↵"
              variant="function"
              onPress={handleEnter}
              disabled={disabled}
            />
          </View>

          {/* Row 5: Clear */}
          <View className="flex-row justify-center">
            <KeypadButton
              value="C"
              variant="clear"
              onPress={handleClear}
              disabled={disabled}
            />
          </View>
        </View>

        {/* Usage Hint */}
      </View>
    );
  }
);

export default Keypad;

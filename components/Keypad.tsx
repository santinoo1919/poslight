import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import type {
  KeypadProps,
  ButtonVariant,
  KeypadButtonProps,
} from "../types/components";
import { useTheme } from "../stores/themeStore";
import { getKeypadButtonSize, getTouchTargetSize } from "../utils/responsive";

// Keypad button component - single responsibility
const KeypadButton: React.FC<KeypadButtonProps> = ({
  value,
  onPress,
  variant = "default",
  disabled = false,
}) => {
  const { isDark } = useTheme();

  const getButtonStyle = (): string => {
    const touchTarget = getTouchTargetSize();
    const baseStyle = `flex-1 aspect-square ${touchTarget} rounded-lg items-center justify-center mx-1 mb-2`;

    // Keep subtle tints for action buttons, neutral for numbers
    switch (variant) {
      case "number":
        return `${baseStyle} ${isDark ? "bg-background-dark border-border-dark" : "bg-background-light border-border-light"}`;
      case "function":
        return `${baseStyle} ${isDark ? "bg-blue-900 bg-opacity-30 border-blue-700" : "bg-blue-50 bg-opacity-30 border-blue-200"}`;
      case "clear":
        return `${baseStyle} ${isDark ? "bg-red-900 bg-opacity-30 border-red-700" : "bg-red-50 bg-opacity-30 border-red-200"}`;
      default:
        return `${baseStyle} ${isDark ? "bg-background-dark border-border-dark" : "bg-background-light border-border-light"}`;
    }
  };

  const getTextStyle = (): string => {
    const baseStyle = "font-bold text-3xl";

    // Match text colors to button tints
    switch (variant) {
      case "number":
        return `${baseStyle} ${isDark ? "text-text-inverse" : "text-text-primary"}`;
      case "function":
        return `${baseStyle} ${isDark ? "text-blue-300" : "text-blue-700"}`;
      case "clear":
        return `${baseStyle} ${isDark ? "text-red-300" : "text-red-700"}`;
      default:
        return `${baseStyle} ${isDark ? "text-text-inverse" : "text-text-primary"}`;
    }
  };

  const handlePress = () => {
    // Light haptic feedback for keypad buttons
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(value);
  };

  return (
    <TouchableOpacity
      className={getButtonStyle()}
      onPress={handlePress}
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
    const { isDark } = useTheme();
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
      <View
        className={`${isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light"} border-t p-2`}
      >
        {/* Keypad Header */}
        <View className="mb-3">
          <Text
            className={`text-sm font-medium ${isDark ? "text-text-inverse" : "text-text-primary"} text-center`}
          >
            💰 Quantity Keypad
          </Text>
        </View>

        {/* Keypad Grid */}
        <View className="items-center space-y-2">
          {/* Row 1: 1, 2, 3 */}
          <View className="flex-row space-x-2">
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
          <View className="flex-row space-x-2">
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
          <View className="flex-row space-x-2">
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

          {/* Row 4: C (Clear), 0, Enter */}
          <View className="flex-row space-x-2">
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
            <KeypadButton
              value="↵"
              variant="function"
              onPress={handleEnter}
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

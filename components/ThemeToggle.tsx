import React from "react";
import { Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";

interface ThemeToggleProps {
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
}

export default function ThemeToggle({
  size = "medium",
  showIcon = true,
}: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  const iconSize = {
    small: 16,
    medium: 20,
    large: 24,
  };

  return (
    <View className="flex-row items-center space-x-2">
      {showIcon && (
        <Ionicons
          name={isDark ? "sunny" : "moon"}
          size={iconSize[size]}
          color={isDark ? "#f59e0b" : "#6b7280"}
        />
      )}
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        trackColor={{
          false: "#e5e7eb", // border-light
          true: "#3b82f6", // brand-primary
        }}
        thumbColor="#ffffff"
        ios_backgroundColor="#e5e7eb"
      />
    </View>
  );
}

// Simple icon-only toggle
export function ThemeToggleIcon() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Switch
      value={isDark}
      onValueChange={toggleTheme}
      trackColor={{
        false: "#e5e7eb", // border-light
        true: "#3b82f6", // brand-primary
      }}
      thumbColor="#ffffff"
      ios_backgroundColor="#e5e7eb"
    />
  );
}

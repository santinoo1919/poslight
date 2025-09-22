import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../stores/themeStore";

interface ModalHeaderProps {
  onClose: () => void;
}

export default function ModalHeader({ onClose }: ModalHeaderProps) {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center justify-between p-4 border-b ${
        isDark ? "border-surface-dark" : "border-surface-light"
      }`}
    >
      <TouchableOpacity onPress={onClose}>
        <Ionicons
          name="close"
          size={24}
          color={isDark ? "#9ca3af" : "#6b7280"}
        />
      </TouchableOpacity>

      <Text
        className={`text-lg font-semibold ${
          isDark ? "text-text-inverse" : "text-text-primary"
        }`}
      >
        Add Product
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );
}

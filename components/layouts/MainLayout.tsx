import React from "react";
import { View } from "react-native";
import type { MainLayoutProps } from "../../types/components";
import { useTheme } from "../../stores/themeStore";

export default function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-1 flex-row ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      {/* Left Panel - Product Management */}
      <View
        className={`flex-1 flex-col ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      >
        {leftPanel}
      </View>

      {/* Right Panel - POS Interface (Not Full Height) */}
      <View
        className={`w-80 ${isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light"} border-l h-auto`}
      >
        {rightPanel}
      </View>
    </View>
  );
}

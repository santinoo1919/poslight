import React from "react";
import { View } from "react-native";
import type { MainLayoutProps } from "../../types/components";

export default function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <View className="flex-1 flex-row bg-background-light dark:bg-background-dark">
      {/* Left Panel - Product Management */}
      <View className="flex-1 flex-col bg-background-light dark:bg-background-dark">
        {leftPanel}
      </View>

      {/* Right Panel - POS Interface (Not Full Height) */}
      <View className="w-80 bg-surface-light dark:bg-surface-dark border-l border-border-light dark:border-border-dark h-auto">
        {rightPanel}
      </View>
    </View>
  );
}

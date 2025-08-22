import React from "react";
import { View } from "react-native";

interface MainLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
}

export default function MainLayout({ leftPanel, rightPanel }: MainLayoutProps) {
  return (
    <View className="flex-1 flex-row bg-gray-100">
      {/* Left Panel - Product Management */}
      <View className="flex-1 flex-col bg-gray-100">{leftPanel}</View>

      {/* Right Panel - POS Interface (Not Full Height) */}
      <View className="w-80 bg-white border-l border-gray-200 h-auto">
        {rightPanel}
      </View>
    </View>
  );
}

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../stores/authStore";
import ThemeToggle from "./ThemeToggle";
import DailyMetricsCard from "./DailyMetricsCard";

export default function Header() {
  const { signOut } = useAuthStore();

  return (
    <View className="bg-surface-light dark:bg-surface-dark pt-4 pb-3 px-4 border-b border-border-light dark:border-border-dark sticky top-0 z-10">
      <View className="flex-row items-center justify-between">
        {/* Left side - Empty space to balance layout */}
        <View className="w-40" />

        {/* Centered title and subtitle */}
        <View className="items-center flex-1">
          <Text className="text-xl font-bold text-text-primary dark:text-text-inverse text-center">
            POS Light
          </Text>
          <Text className="text-text-secondary dark:text-text-muted mt-1 text-sm text-center">
            Simple • Fast • Offline
          </Text>
        </View>

        {/* Right side - Daily metrics, theme toggle and logout button */}
        <View className="flex-shrink-0 flex-row items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle size="small" showIcon={false} />

          {/* Tappable Daily Metrics Card */}
          <DailyMetricsCard />

          {/* Logout Button */}
          <TouchableOpacity
            onPress={signOut}
            className="bg-interactive-disabled dark:bg-interactive-disabledDark px-4 py-2 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

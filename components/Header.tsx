import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";
import { useDrawerStore } from "../stores/drawerStore";
import DailyMetricsCard from "./DailyMetricsCard";

export default function Header() {
  const { isDark } = useTheme();
  const { openSettingsDrawer } = useDrawerStore();

  return (
    <View
      className={`${isDark ? "bg-surface-dark" : "bg-surface-light"} pt-4 pb-3 px-4 border-b ${isDark ? "border-border-dark" : "border-border-light"} sticky top-0 z-10`}
    >
      <View className="flex-row items-center justify-between">
        {/* Left side - Empty space to balance layout */}
        <View className="w-40" />

        {/* Centered title and subtitle */}
        <View className="items-center flex-1">
          <Text
            className={`text-xl font-bold ${isDark ? "text-text-inverse" : "text-text-primary"} text-center`}
          >
            POS Light
          </Text>
          <Text
            className={`${isDark ? "text-text-muted" : "text-text-secondary"} mt-1 text-sm text-center`}
          >
            Simple • Fast • Offline
          </Text>
        </View>

        {/* Right side - Daily metrics and settings button */}
        <View className="flex-shrink-0 flex-row items-center space-x-3">
          {/* Tappable Daily Metrics Card */}
          <DailyMetricsCard />

          {/* Settings Icon */}
          <TouchableOpacity
            onPress={openSettingsDrawer}
            className="p-2 ml-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={28}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// components/DailyMetricsCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useMetricsStore } from "../stores/metricsStore";
import { useDrawerStore } from "../stores/drawerStore";
import { useTheme } from "../stores/themeStore";

export default function DailyMetricsCard() {
  const { isDark } = useTheme();
  const { dailyRevenue, dailyProfit } = useMetricsStore();
  const { openSalesDrawer } = useDrawerStore();

  return (
    <TouchableOpacity
      onPress={openSalesDrawer}
      className={`${isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light"} border rounded-lg px-4 py-2 mx-4`}
      activeOpacity={0.7}
    >
      <View className="flex-row w-auto gap-x-3 items-center">
        <View className="items-center gap-y-1">
          <Text
            className={`text-xs ${isDark ? "text-text-muted" : "text-text-secondary"}`}
          >
            Today's Revenue
          </Text>
          <Text
            className={`text-lg font-bold ${isDark ? "text-state-successDark" : "text-state-success"}`}
          >
            €{dailyRevenue.toFixed(2)}
          </Text>
        </View>
        <View
          className={`w-px h-8 ${isDark ? "bg-border-dark" : "bg-border-light"}`}
        ></View>
        <View className="items-center gap-y-1">
          <Text
            className={`text-xs ${isDark ? "text-text-muted" : "text-text-secondary"}`}
          >
            Today's Profit
          </Text>
          <Text
            className={`text-lg font-bold ${isDark ? "text-brand-primaryDark" : "text-brand-primary"}`}
          >
            €{dailyProfit.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

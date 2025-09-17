// components/DailyMetricsCard.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useMetricsStore } from "../stores/metricsStore";
import { useDrawerStore } from "../stores/drawerStore";

export default function DailyMetricsCard() {
  const { dailyRevenue, dailyProfit } = useMetricsStore();
  const { openSalesDrawer } = useDrawerStore();

  return (
    <TouchableOpacity
      onPress={openSalesDrawer}
      className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 ml-4"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center space-x-3">
        <View className="items-center">
          <Text className="text-xs text-text-secondary dark:text-text-muted">
            Today's Revenue
          </Text>
          <Text className="text-sm font-bold text-state-success dark:text-state-successDark">
            €{dailyRevenue.toFixed(2)}
          </Text>
        </View>
        <View className="w-px h-8 bg-border-light dark:bg-border-dark"></View>
        <View className="items-center">
          <Text className="text-xs text-text-secondary dark:text-text-muted">
            Today's Profit
          </Text>
          <Text className="text-sm font-bold text-brand-primary dark:text-brand-primaryDark">
            €{dailyProfit.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

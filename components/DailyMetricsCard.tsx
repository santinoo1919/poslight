import React from "react";
import { View, Text } from "react-native";
import type { DailyMetricsCardProps } from "../types/components";

const DailyMetricsCard: React.FC<DailyMetricsCardProps> = React.memo(
  ({ dailyRevenue, dailyProfit }) => {
    return (
      <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 ml-4">
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
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if revenue or profit actually changed
    return (
      prevProps.dailyRevenue === nextProps.dailyRevenue &&
      prevProps.dailyProfit === nextProps.dailyProfit
    );
  }
);

export default DailyMetricsCard;

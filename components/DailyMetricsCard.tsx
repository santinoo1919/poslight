import React from "react";
import { View, Text } from "react-native";
import type { DailyMetricsCardProps } from "../types/components";

const DailyMetricsCard: React.FC<DailyMetricsCardProps> = React.memo(
  ({ dailyRevenue, dailyProfit }) => {
    return (
      <View className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg px-3 py-2 ml-4">
        <View className="flex-row items-center space-x-3">
          <View className="items-center">
            <Text className="text-xs text-gray-600">Today's Revenue</Text>
            <Text className="text-sm font-bold text-green-600">
              €{dailyRevenue.toFixed(2)}
            </Text>
          </View>
          <View className="w-px h-8 bg-gray-300"></View>
          <View className="items-center">
            <Text className="text-xs text-gray-600">Today's Profit</Text>
            <Text className="text-sm font-bold text-blue-600">
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

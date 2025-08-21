import React from "react";
import { View, Text } from "react-native";

interface DailyMetricsCardProps {
  dailyRevenue: number;
  dailyProfit: number;
}

const DailyMetricsCard: React.FC<DailyMetricsCardProps> = ({
  dailyRevenue,
  dailyProfit,
}) => {
  return (
    <View className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
      <View className="flex-row items-center space-x-4">
        <View className="items-center">
          <Text className="text-xs text-blue-600 font-medium">Revenue</Text>
          <Text className="text-sm font-bold text-blue-800">
            €{dailyRevenue.toFixed(2)}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-blue-600 font-medium">Profit</Text>
          <Text className="text-sm font-bold text-blue-800">
            €{dailyProfit.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DailyMetricsCard;

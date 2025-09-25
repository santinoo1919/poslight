import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";

interface StockEntryCardProps {
  stockUpdate: {
    id: string;
    product_name: string;
    quantity_added: number;
    old_stock: number;
    new_stock: number;
    created_at: string;
    buy_price: number;
  };
}

export default function StockEntryCard({ stockUpdate }: StockEntryCardProps) {
  const { isDark } = useTheme();

  const {
    product_name,
    quantity_added,
    old_stock,
    new_stock,
    created_at,
    buy_price,
  } = stockUpdate;
  const timestamp = new Date(created_at);
  const timeString = timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalCost = buy_price * quantity_added;

  return (
    <View
      className={`${isDark ? "bg-background-dark/30" : "bg-background-light/30"} border ${isDark ? "border-border-dark/20" : "border-border-light/20"} rounded-lg p-4 mb-4 opacity-60`}
    >
      {/* Time and Total Cost - Same structure as sales */}
      <View className="flex-row justify-between items-center mb-3">
        <Text
          className={`text-base ${
            isDark ? "text-text-muted" : "text-text-secondary"
          }`}
        >
          {timeString}
        </Text>
        <Text
          className={`text-xl font-bold ${
            isDark ? "text-text-inverse" : "text-text-primary"
          }`}
        >
          €{totalCost.toFixed(2)}
        </Text>
      </View>

      {/* Product and Stock Movement */}
      <View className="space-y-3">
        <View className="flex-row justify-between items-center py-2">
          <View className="flex-1">
            <Text
              className={`text-base font-medium ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              {product_name}
            </Text>
            <Text
              className={`text-sm ${
                isDark ? "text-text-muted" : "text-text-secondary"
              }`}
            >
              +{quantity_added} units ({old_stock} → {new_stock})
            </Text>
          </View>
          <Text
            className={`text-base font-semibold ${
              isDark ? "text-text-inverse" : "text-text-primary"
            }`}
          >
            €{buy_price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

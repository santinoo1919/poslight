// components/SalesSidePanel.tsx
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../services/tinybaseStore";
import { useTheme } from "../stores/themeStore";

interface SalesSidePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SalesSidePanel({
  isVisible,
  onClose,
}: SalesSidePanelProps) {
  const { isDark } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh data when panel becomes visible
  useEffect(() => {
    if (isVisible) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [isVisible]);

  // Get local sales data from TinyBase store
  const sales = useMemo(() => {
    const transactions = db.getTodayTransactions();
    const products = db.getProducts();

    return transactions
      .map((transaction) => ({
        id: transaction.id,
        total_amount: transaction.total_amount,
        created_at: transaction.created_at,
        sale_items: db.getTransactionItems(transaction.id).map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return {
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.total_price,
            products: {
              name: product?.name || `Product ${item.product_id}`,
            },
          };
        }),
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ); // Latest first
  }, [refreshKey]);

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Backdrop */}
      <TouchableOpacity
        className="flex-1 bg-black bg-opacity-50"
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Side Panel */}
      <View
        className={`absolute right-0 top-0 bottom-0 w-80 shadow-lg ${
          isDark ? "bg-surface-dark" : "bg-surface-light"
        }`}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between px-4 py-4 border-b ${
            isDark ? "border-border-dark" : "border-border-light"
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDark ? "text-text-inverse" : "text-text-primary"
            }`}
          >
            Today's Sales ({sales?.length || 0})
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text
              className={`text-lg ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              ×
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className={`flex-1 px-4 py-2 ${
            isDark ? "bg-background-dark" : "bg-background-light"
          }`}
        >
          {!sales || sales.length === 0 ? (
            <View className="py-8">
              <Text
                className={`text-center ${
                  isDark ? "text-text-muted" : "text-text-secondary"
                }`}
              >
                No sales today yet
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {sales.map((sale) => (
                <View
                  key={sale.id}
                  className={`rounded-lg p-4 border ${
                    isDark
                      ? "bg-background-dark border-border-dark"
                      : "bg-background-light border-border-light"
                  }`}
                >
                  {/* Time and Total */}
                  <View className="flex-row justify-between items-center mb-2">
                    <Text
                      className={`text-sm ${
                        isDark ? "text-text-muted" : "text-text-secondary"
                      }`}
                    >
                      {new Date(sale.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Text
                      className={`text-lg font-bold ${
                        isDark ? "text-state-successDark" : "text-state-success"
                      }`}
                    >
                      €{sale.total_amount.toFixed(2)}
                    </Text>
                  </View>

                  {/* Items */}
                  <View className="space-y-1">
                    {sale.sale_items?.map((item, index) => (
                      <View
                        key={index}
                        className="flex-row justify-between items-center"
                      >
                        <View className="flex-1">
                          <Text
                            className={`text-sm font-medium ${
                              isDark ? "text-text-inverse" : "text-text-primary"
                            }`}
                          >
                            {item.products?.name || "Unknown Product"}
                          </Text>
                          <Text
                            className={`text-xs ${
                              isDark ? "text-text-muted" : "text-text-secondary"
                            }`}
                          >
                            {item.quantity}x @ €{item.unit_price.toFixed(2)}
                          </Text>
                        </View>
                        <Text
                          className={`text-sm font-semibold ${
                            isDark ? "text-text-inverse" : "text-text-primary"
                          }`}
                        >
                          €{item.total_price.toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

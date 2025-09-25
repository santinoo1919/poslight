// components/HistoryPanel.tsx
import React, { useMemo, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../services/tinybaseStore";
import { useTheme } from "../stores/themeStore";
import { useMetricsStore } from "../stores/metricsStore";
import { BackupService } from "../services/backupService";
import { isIPad, isIPadPro, isIPadAir, isIPadMini } from "../utils/responsive";
import StockEntryCard from "./StockEntryCard";

interface HistoryPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function HistoryPanel({
  isVisible,
  onClose,
}: HistoryPanelProps) {
  const { isDark } = useTheme();
  const { resetDaily } = useMetricsStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isClosingDay, setIsClosingDay] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "past">("today");
  const [isLoadingPast, setIsLoadingPast] = useState(false);
  const [isTodayClosed, setIsTodayClosed] = useState(false);

  // Responsive panel width based on device
  const getPanelWidth = () => {
    if (isIPadPro) return 400; // iPad Pro: wider panel
    if (isIPadAir) return 360; // iPad Air: medium panel
    if (isIPadMini) return 320; // iPad Mini: smaller panel
    return 320; // Default for phones
  };

  // Refresh data when panel becomes visible
  useEffect(() => {
    if (isVisible) {
      setRefreshKey((prev) => prev + 1);
      checkIfTodayClosed();
    }
  }, [isVisible]);

  // Check if today was already closed
  const checkIfTodayClosed = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const backups = await BackupService.listBackups();
      const todayBackup = backups.find((backup) =>
        backup.includes(`backup_${today}`)
      );
      setIsTodayClosed(!!todayBackup);
    } catch (error) {
      console.warn("Failed to check if today was closed:", error);
    }
  };

  const handleCloseDay = async () => {
    Alert.alert(
      "Close Day",
      "Are you sure you want to close the day? This will:\n\n• Save a backup of today's data\n• Reset all metrics to zero\n• Start fresh for tomorrow\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close Day",
          style: "destructive",
          onPress: async () => {
            setIsClosingDay(true);
            try {
              // Create end-of-day backup
              const backupFile = await BackupService.createBackup();
              console.log("✅ End-of-day backup created:", backupFile);

              // Reset daily metrics to zero
              resetDaily();

              // Mark today as closed
              setIsTodayClosed(true);

              // Refresh the panel to show updated data
              setRefreshKey((prev) => prev + 1);

              Alert.alert(
                "Day Closed Successfully",
                "Today's data has been backed up and metrics have been reset. You're ready for tomorrow!",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("❌ Failed to close day:", error);
              Alert.alert("Error", `Failed to close day: ${error.message}`, [
                { text: "OK" },
              ]);
            } finally {
              setIsClosingDay(false);
            }
          },
        },
      ]
    );
  };

  // Get today's activities
  const todayActivities = useMemo(() => {
    const transactions = db.getTodayTransactions();
    const stockUpdates = db.getTodayStockUpdates();
    const products = db.getProducts();

    const salesData = transactions.map((transaction) => ({
      id: transaction.id,
      type: "sale" as const,
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
    }));

    const stockEntries = stockUpdates.map((stockUpdate) => {
      const product = products.find((p) => p.id === stockUpdate.product_id);
      // Get buy price from inventory
      const inventory = db.getInventoryForProduct(stockUpdate.product_id);
      const buy_price = inventory?.buy_price || 0;

      return {
        id: stockUpdate.id,
        type: "stock_update" as const,
        product_name: product?.name || `Product ${stockUpdate.product_id}`,
        quantity_added: stockUpdate.new_stock - stockUpdate.old_stock,
        old_stock: stockUpdate.old_stock,
        new_stock: stockUpdate.new_stock,
        created_at: stockUpdate.created_at,
        buy_price: buy_price,
      };
    });

    // Combine and sort by timestamp (newest first)
    return [...salesData, ...stockEntries].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [refreshKey]);

  // Get past activities grouped by date (only calculate when past tab is active)
  const pastActivities = useMemo(() => {
    if (activeTab !== "past") return {};

    const allTransactions = db.getAllTransactions();
    const allStockUpdates = db.getAllStockUpdates();
    const products = db.getProducts();

    // Filter out today's data for past tab
    const today = new Date().toISOString().split("T")[0];
    const pastTransactions = allTransactions.filter(
      (transaction) => !(transaction.created_at as string).startsWith(today)
    );
    const pastStockUpdates = allStockUpdates.filter(
      (stockUpdate) => !(stockUpdate.created_at as string).startsWith(today)
    );

    const salesData = pastTransactions.map((transaction) => ({
      id: transaction.id,
      type: "sale" as const,
      total_amount: transaction.total_amount,
      created_at: transaction.created_at,
      sale_items: db.getTransactionItems(transaction.id).map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          product_name: product?.name || `Product ${item.product_id}`,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
        };
      }),
    }));

    const stockEntries = pastStockUpdates.map((stockUpdate) => {
      const product = products.find((p) => p.id === stockUpdate.product_id);
      const inventory = db.getInventoryForProduct(stockUpdate.product_id);
      return {
        id: stockUpdate.id,
        type: "stock_update" as const,
        product_name: product?.name || `Product ${stockUpdate.product_id}`,
        quantity_added: stockUpdate.new_stock - stockUpdate.old_stock,
        old_stock: stockUpdate.old_stock,
        new_stock: stockUpdate.new_stock,
        created_at: stockUpdate.created_at,
        buy_price: inventory?.buy_price || 0,
      };
    });

    const allActivities = [...salesData, ...stockEntries].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Group by date
    const groupedByDate: Record<string, typeof allActivities> = {};
    allActivities.forEach((activity) => {
      const date = new Date(activity.created_at).toDateString();
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(activity);
    });

    return groupedByDate;
  }, [refreshKey, activeTab]);

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Backdrop with opacity */}
      <TouchableOpacity
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        className="flex-1"
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Side Panel */}
      <View
        style={{
          width: getPanelWidth(),
          backgroundColor: isDark ? "#1f2937" : "#f9fafb", // bg-surface-dark : bg-surface-light
        }}
        className="absolute right-0 top-0 bottom-0 shadow-lg"
      >
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-xl font-semibold ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              History
            </Text>
            <TouchableOpacity onPress={onClose} className="p-3">
              <Ionicons
                name="close-outline"
                size={28}
                color={isDark ? "#9ca3af" : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View
            className={`flex-row ${isDark ? "bg-background-dark" : "bg-background-light"} border-b ${isDark ? "border-border-dark" : "border-border-light"}`}
          >
            <TouchableOpacity
              onPress={() => setActiveTab("today")}
              className={`flex-1 py-3 px-4 ${
                activeTab === "today"
                  ? `${isDark ? "bg-surface-dark border-b-2 border-state-successDark" : "bg-surface-light border-b-2 border-state-success"}`
                  : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "today"
                    ? `${isDark ? "text-text-inverse" : "text-text-primary"}`
                    : `${isDark ? "text-text-muted" : "text-text-secondary"}`
                }`}
              >
                Today ({todayActivities?.length || 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (activeTab !== "past") {
                  setIsLoadingPast(true);
                  setActiveTab("past");
                  // Simulate loading time for smooth transition
                  setTimeout(() => setIsLoadingPast(false), 100);
                }
              }}
              className={`flex-1 py-3 px-4 ${
                activeTab === "past"
                  ? `${isDark ? "bg-surface-dark border-b-2 border-state-successDark" : "bg-surface-light border-b-2 border-state-success"}`
                  : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "past"
                    ? `${isDark ? "text-text-inverse" : "text-text-primary"}`
                    : `${isDark ? "text-text-muted" : "text-text-secondary"}`
                }`}
              >
                Past
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          className={`flex-1 px-4 py-4 ${
            isDark ? "bg-background-dark" : "bg-background-light"
          }`}
        >
          {activeTab === "today" ? (
            // Today Tab
            !todayActivities || todayActivities.length === 0 ? (
              <View className="py-12">
                <Text
                  className={`text-center text-lg ${
                    isDark ? "text-text-muted" : "text-text-secondary"
                  }`}
                >
                  No activity today yet
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                {todayActivities.map((activity) =>
                  activity.type === "sale" ? (
                    <View
                      key={activity.id}
                      className={`${isDark ? "bg-background-dark" : "bg-background-light"} rounded-lg p-4 border mb-4 ${
                        isDark ? "border-border-dark" : "border-border-light"
                      }`}
                    >
                      {/* Time and Total */}
                      <View className="flex-row justify-between items-center mb-3">
                        <Text
                          className={`text-base ${
                            isDark ? "text-text-muted" : "text-text-secondary"
                          }`}
                        >
                          {new Date(activity.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                        <Text
                          className={`text-xl font-bold ${
                            isDark
                              ? "text-state-successDark"
                              : "text-state-success"
                          }`}
                        >
                          €{activity.total_amount.toFixed(2)}
                        </Text>
                      </View>

                      {/* Items */}
                      <View className="space-y-3">
                        {activity.sale_items?.map((item, index) => (
                          <View
                            key={index}
                            className="flex-row justify-between items-center py-2"
                          >
                            <View className="flex-1">
                              <Text
                                className={`text-base font-medium ${
                                  isDark
                                    ? "text-text-inverse"
                                    : "text-text-primary"
                                }`}
                              >
                                {item.products?.name || "Unknown Product"}
                              </Text>
                              <Text
                                className={`text-sm ${
                                  isDark
                                    ? "text-text-muted"
                                    : "text-text-secondary"
                                }`}
                              >
                                {item.quantity}x @ €{item.unit_price.toFixed(2)}
                              </Text>
                            </View>
                            <Text
                              className={`text-base font-semibold ${
                                isDark
                                  ? "text-text-inverse"
                                  : "text-text-primary"
                              }`}
                            >
                              €{item.total_price.toFixed(2)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <StockEntryCard key={activity.id} stockUpdate={activity} />
                  )
                )}
              </View>
            )
          ) : // Past Tab
          isLoadingPast ? (
            <View className="py-12">
              <Text
                className={`text-center text-lg ${
                  isDark ? "text-text-muted" : "text-text-secondary"
                }`}
              >
                Loading past activities...
              </Text>
            </View>
          ) : Object.keys(pastActivities).length === 0 ? (
            <View className="py-12">
              <Text
                className={`text-center text-lg ${
                  isDark ? "text-text-muted" : "text-text-secondary"
                }`}
              >
                No past activities
              </Text>
            </View>
          ) : (
            <View className="space-y-6">
              {Object.entries(pastActivities)
                .sort(
                  ([dateA], [dateB]) =>
                    new Date(dateB).getTime() - new Date(dateA).getTime()
                )
                .map(([date, activities]) => (
                  <View key={date} className="space-y-3">
                    {/* Date Header */}
                    <View className="flex-row items-center justify-between py-2">
                      <Text
                        className={`text-lg font-semibold ${
                          isDark ? "text-text-inverse" : "text-text-primary"
                        }`}
                      >
                        {new Date(date).toLocaleDateString([], {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                      <Text
                        className={`text-sm ${
                          isDark ? "text-text-muted" : "text-text-secondary"
                        }`}
                      >
                        {activities.length} activities
                      </Text>
                    </View>

                    {/* Activities for this date */}
                    <View className="space-y-3">
                      {activities.map((activity) =>
                        activity.type === "sale" ? (
                          <View
                            key={activity.id}
                            className={`${isDark ? "bg-background-dark" : "bg-background-light"} rounded-lg p-4 border mb-4 ${
                              isDark
                                ? "border-border-dark"
                                : "border-border-light"
                            }`}
                          >
                            {/* Sale Header */}
                            <View className="flex-row justify-between items-center mb-3">
                              <Text
                                className={`text-base ${
                                  isDark
                                    ? "text-text-muted"
                                    : "text-text-secondary"
                                }`}
                              >
                                {new Date(
                                  activity.created_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Text>
                              <Text
                                className={`text-xl font-bold ${
                                  isDark
                                    ? "text-state-successDark"
                                    : "text-state-success"
                                }`}
                              >
                                €{activity.total_amount.toFixed(2)}
                              </Text>
                            </View>

                            {/* Items */}
                            <View className="space-y-3">
                              {activity.sale_items?.map((item, index) => (
                                <View
                                  key={index}
                                  className="flex-row justify-between items-center py-2"
                                >
                                  <View className="flex-1">
                                    <Text
                                      className={`text-base font-medium ${
                                        isDark
                                          ? "text-text-inverse"
                                          : "text-text-primary"
                                      }`}
                                    >
                                      {item.product_name}
                                    </Text>
                                    <Text
                                      className={`text-sm ${
                                        isDark
                                          ? "text-text-muted"
                                          : "text-text-secondary"
                                      }`}
                                    >
                                      {item.quantity}x @ €
                                      {item.unit_price.toFixed(2)}
                                    </Text>
                                  </View>
                                  <Text
                                    className={`text-base font-semibold ${
                                      isDark
                                        ? "text-text-inverse"
                                        : "text-text-primary"
                                    }`}
                                  >
                                    €{item.total_price.toFixed(2)}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        ) : (
                          <StockEntryCard
                            key={activity.id}
                            stockUpdate={activity}
                          />
                        )
                      )}
                    </View>
                  </View>
                ))}
            </View>
          )}
        </ScrollView>

        {/* Close Day Button */}
        <View
          className={`p-4 border-t ${
            isDark ? "border-border-dark" : "border-border-light"
          }`}
        >
          <TouchableOpacity
            onPress={handleCloseDay}
            disabled={isClosingDay || isTodayClosed}
            className={`py-4 rounded-lg flex-row items-center justify-center ${
              isClosingDay || isTodayClosed
                ? "bg-gray-400"
                : isDark
                  ? "bg-red-600"
                  : "bg-red-500"
            }`}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                isClosingDay
                  ? "hourglass"
                  : isTodayClosed
                    ? "checkmark-circle"
                    : "lock-closed"
              }
              size={24}
              color="white"
            />
            <Text className="text-white text-center font-semibold text-lg ml-2">
              {isClosingDay
                ? "Closing Day..."
                : isTodayClosed
                  ? "Day Closed"
                  : "Close Day"}
            </Text>
          </TouchableOpacity>
          <Text
            className={`text-xs text-center mt-2 ${
              isDark ? "text-text-muted" : "text-text-secondary"
            }`}
          >
            {isTodayClosed
              ? "Today has already been closed. Available again tomorrow."
              : "Saves backup and resets metrics for tomorrow"}
          </Text>
        </View>
      </View>
    </View>
  );
}

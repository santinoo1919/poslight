import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";
import ThemeToggle from "./ThemeToggle";
import DailyMetricsCard from "./DailyMetricsCard";
import { BackupService } from "../services/backupService";

export default function Header() {
  const { lock } = useAuthStore();
  const { isDark } = useTheme();
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      const fileUri = await BackupService.createBackup();
      const fileName = fileUri.split("/").pop() || "";
      const backupInfo = await BackupService.getBackupInfo(fileName);

      Alert.alert(
        "Backup Created! 🎉",
        `File: ${fileName}\nSize: ${BackupService.formatFileSize(backupInfo?.size || 0)}\nDate: ${backupInfo?.date}\n\nBackup saved to device storage.`,
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Backup Failed", error.message);
    } finally {
      setIsBackingUp(false);
    }
  };

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

        {/* Right side - Daily metrics, theme toggle, backup and logout button */}
        <View className="flex-shrink-0 flex-row items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle size="small" showIcon={false} />

          {/* Tappable Daily Metrics Card */}
          <DailyMetricsCard />

          {/* Backup Button */}
          <TouchableOpacity
            onPress={handleBackup}
            disabled={isBackingUp}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons
              name={isBackingUp ? "hourglass-outline" : "cloud-upload-outline"}
              size={24}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>

          {/* Logout Icon */}
          <TouchableOpacity
            onPress={lock}
            className="p-2 ml-3"
            activeOpacity={0.7}
          >
            <Ionicons
              name="log-out-outline"
              size={28}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

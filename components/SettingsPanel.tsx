import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../stores/themeStore";
import { useAuthStore } from "../stores/authStore";
import { useSettingsStore } from "../stores/settingsStore";
import { BackupService } from "../services/backupService";
import { isIPad, isIPadPro, isIPadAir, isIPadMini } from "../utils/responsive";

interface SettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsPanel({
  isVisible,
  onClose,
}: SettingsPanelProps) {
  const { isDark, toggleTheme } = useTheme();
  const { lock } = useAuthStore();
  const { loadSettings } = useSettingsStore();
  const [availableBackups, setAvailableBackups] = useState<string[]>([]);
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [showBackupOptions, setShowBackupOptions] = useState(false);

  // Responsive panel width based on device (same as SalesSidePanel)
  const getPanelWidth = () => {
    if (isIPadPro) return 400; // iPad Pro: wider panel
    if (isIPadAir) return 360; // iPad Air: medium panel
    if (isIPadMini) return 320; // iPad Mini: smaller panel
    return 320; // Default for phones
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load backups when panel becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchBackups();
    }
  }, [isVisible]);

  const fetchBackups = async () => {
    setIsLoadingBackups(true);
    try {
      const backups = await BackupService.listBackups();
      setAvailableBackups(backups);
    } catch (error) {
      Alert.alert("Error", `Failed to load backups: ${error.message}`);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  const handleRestoreBackup = async (fileName: string) => {
    try {
      const backupInfo = await BackupService.getBackupInfo(fileName);

      Alert.alert(
        "Restore Backup",
        `Are you sure you want to restore backup from ${backupInfo?.date}?\n\nThis will replace all current data with the backup data.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              try {
                await BackupService.restoreFromBackup(fileName);
                Alert.alert(
                  "Success",
                  "Backup restored successfully! The app will reload."
                );
                // Note: In a real app, you'd reload the app or refresh data
              } catch (error) {
                Alert.alert(
                  "Error",
                  `Failed to restore backup: ${error.message}`
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", `Failed to get backup info: ${error.message}`);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          lock();
          onClose();
        },
      },
    ]);
  };

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50 bg-black/50">
      <TouchableOpacity
        className="absolute inset-0"
        onPress={onClose}
        activeOpacity={1}
      />
      <View
        className={`absolute right-0 top-0 h-full ${
          isDark ? "bg-surface-dark" : "bg-surface-light"
        } shadow-2xl`}
        style={{ width: getPanelWidth() }}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between p-4 border-b ${
            isDark ? "border-border-dark" : "border-border-light"
          }`}
        >
          <Text
            className={`text-xl font-bold ${
              isDark ? "text-text-inverse" : "text-text-primary"
            }`}
          >
            Settings
          </Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Theme Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Appearance
            </Text>
            <View
              className={`p-4 rounded-lg ${
                isDark ? "bg-background-dark" : "bg-background-light"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={isDark ? "moon" : "sunny"}
                      size={20}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      className={`text-base ${
                        isDark ? "text-text-inverse" : "text-text-primary"
                      }`}
                    >
                      Dark Mode
                    </Text>
                  </View>
                  <Text
                    className={`text-sm ml-7 ${
                      isDark ? "text-text-muted" : "text-text-secondary"
                    }`}
                  >
                    Switch between light and dark theme
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={toggleTheme}
                  className={`w-12 h-6 rounded-full p-1 ${
                    isDark ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <View
                    className={`w-4 h-4 rounded-full bg-white ${
                      isDark ? "ml-6" : "ml-0"
                    }`}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Backup Section */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${
                isDark ? "text-text-inverse" : "text-text-primary"
              }`}
            >
              Data Management
            </Text>
            <View
              className={`p-4 rounded-lg ${
                isDark ? "bg-background-dark" : "bg-background-light"
              }`}
            >
              <TouchableOpacity
                onPress={() => setShowBackupOptions(!showBackupOptions)}
                className={`flex-row items-center justify-between p-3 rounded-lg border ${
                  isDark
                    ? "border-border-dark bg-surface-dark"
                    : "border-border-light bg-surface-light"
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="cloud-download"
                    size={20}
                    color={isDark ? "#9ca3af" : "#6b7280"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`text-base font-medium ${
                      isDark ? "text-text-inverse" : "text-text-primary"
                    }`}
                  >
                    Restore Backup
                  </Text>
                </View>
                <Ionicons
                  name={showBackupOptions ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
              </TouchableOpacity>

              {showBackupOptions && (
                <View className="mt-3">
                  {isLoadingBackups ? (
                    <Text
                      className={`text-center py-4 ${
                        isDark ? "text-text-muted" : "text-text-secondary"
                      }`}
                    >
                      Loading backups...
                    </Text>
                  ) : availableBackups.length === 0 ? (
                    <Text
                      className={`text-center py-4 ${
                        isDark ? "text-text-muted" : "text-text-secondary"
                      }`}
                    >
                      No backups available
                    </Text>
                  ) : (
                    <View>
                      {availableBackups.slice(0, 5).map((backup) => (
                        <TouchableOpacity
                          key={backup}
                          onPress={() => handleRestoreBackup(backup)}
                          className={`p-3 rounded-lg border mb-2 ${
                            isDark
                              ? "border-border-dark bg-surface-dark"
                              : "border-border-light bg-surface-light"
                          }`}
                        >
                          <Text
                            className={`text-sm font-medium ${
                              isDark ? "text-text-inverse" : "text-text-primary"
                            }`}
                          >
                            {backup}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {availableBackups.length > 5 && (
                        <Text
                          className={`text-xs text-center ${
                            isDark ? "text-text-muted" : "text-text-secondary"
                          }`}
                        >
                          ... and {availableBackups.length - 5} more
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Footer - Logout Button */}
        <View
          className={`p-4 border-t ${
            isDark ? "border-border-dark" : "border-border-light"
          }`}
        >
          <TouchableOpacity
            onPress={handleLogout}
            className={`py-3 px-4 rounded-lg ${
              isDark ? "bg-red-600" : "bg-red-500"
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

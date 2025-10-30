// components/LoginScreen.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";
import { isPlatformWeb, shouldEnableBiometric } from "../utils/platform";

export default function LoginScreen() {
  const {
    isUnlocked,
    isLoading,
    error,
    faceIdAvailable,
    faceIdType,
    unlock,
    checkFaceIdAvailability,
    clearError,
  } = useAuthStore();
  const { isDark } = useTheme();

  const isWeb = isPlatformWeb();
  const biometricEnabled = shouldEnableBiometric();

  // Check Face ID availability on component mount (only on native)
  useEffect(() => {
    if (biometricEnabled) {
      checkFaceIdAvailability();
    }
  }, [biometricEnabled]);

  const handleUnlock = async () => {
    // On web: skip biometric and unlock directly
    if (isWeb) {
      const defaultUser = {
        id: "owner",
        name: "Store Owner",
        role: "owner" as const,
      };
      // Directly unlock without biometric
      const newState = {
        isUnlocked: true,
        currentUser: defaultUser,
        error: null,
        isLoading: false,
      };
      useAuthStore.setState(newState);
    } else {
      // On native: use biometric auth
      await unlock();
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark px-6">
      <View className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-8 border border-border-light dark:border-border-dark">
        {/* Header matching POS style */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-text-primary dark:text-text-inverse mb-2">
            POS Light
          </Text>
          <Text className="text-text-secondary dark:text-text-muted text-center">
            Unlock to continue
          </Text>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mb-4 p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <Text className="text-red-800 dark:text-red-200 text-sm text-center">
              {error}
            </Text>
            <TouchableOpacity onPress={clearError} className="mt-2">
              <Text className="text-red-600 dark:text-red-400 text-xs text-center">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Platform-aware unlock button */}
        {isWeb ? (
          // Web: Simple continue button
          <View className="mb-6">
            <TouchableOpacity
              className={`py-4 rounded-lg flex-row items-center justify-center ${
                isDark ? "bg-blue-600" : "bg-blue-500"
              }`}
              onPress={handleUnlock}
              disabled={isLoading}
            >
              <Ionicons
                name="lock-open"
                size={24}
                color="white"
                style={{ marginRight: 12 }}
              />
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading ? "Loading..." : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : faceIdAvailable ? (
          // Native: Face ID/Touch ID button
          <View className="mb-6">
            <TouchableOpacity
              className={`py-4 rounded-lg flex-row items-center justify-center ${
                isDark ? "bg-blue-600" : "bg-blue-500"
              }`}
              onPress={handleUnlock}
              disabled={isLoading}
            >
              <Ionicons
                name={faceIdType === "face" ? "scan" : "finger-print"}
                size={24}
                color="white"
                style={{ marginRight: 12 }}
              />
              <Text className="text-white text-center font-semibold text-lg">
                {isLoading
                  ? "Authenticating..."
                  : faceIdType === "face"
                    ? "Unlock with Face ID"
                    : "Unlock with Touch ID"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <Text className="text-yellow-800 dark:text-yellow-200 text-sm text-center">
              Face ID/Touch ID not available on this device
            </Text>
          </View>
        )}

        {/* Help Text */}
        <Text className="text-sm text-center text-text-secondary dark:text-text-muted">
          {isWeb
            ? "Click to continue to your POS system"
            : "Use biometric authentication to unlock your POS system"}
        </Text>
      </View>
    </View>
  );
}

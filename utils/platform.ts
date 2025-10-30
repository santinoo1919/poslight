/**
 * Platform detection utilities
 * Used to conditionally enable/disable platform-specific features
 */

import { Platform } from "react-native";

/**
 * Check if running on web platform
 */
export const isPlatformWeb = (): boolean => Platform.OS === "web";

/**
 * Check if running on native platforms (iOS/Android)
 */
export const isNativePlatform =
  Platform.OS === "ios" || Platform.OS === "android";

/**
 * Check if running on iOS
 */
export const isPlatformIOS = Platform.OS === "ios";

/**
 * Check if running on Android
 */
export const isPlatformAndroid = Platform.OS === "android";

/**
 * Check if RevenueCat/paywall should be enabled
 * RevenueCat only works on native platforms
 */
export const shouldEnablePaywall = (): boolean => {
  return isNativePlatform;
};

/**
 * Check if biometric authentication should be enabled
 * Biometrics only work on native platforms
 */
export const shouldEnableBiometric = (): boolean => {
  return isNativePlatform;
};

/**
 * Platform-specific configuration
 */
export const PlatformConfig = {
  web: isPlatformWeb(),
  native: isNativePlatform,
  ios: isPlatformIOS,
  android: isPlatformAndroid,
} as const;

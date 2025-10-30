/**
 * Subscription/Paywall Management Hook
 *
 * Manages subscription state and RevenueCat initialization
 * - On web: Always grants access (no paywall)
 * - On native: Checks RevenueCat subscription status
 */

import { useState, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { shouldEnablePaywall } from "../utils/platform";

// Conditionally import RevenueCat only on native platforms
let Purchases: any = null;
let LOG_LEVEL: any = null;
if (Platform.OS !== "web") {
  try {
    const PurchasesModule = require("react-native-purchases");
    Purchases = PurchasesModule.default;
    LOG_LEVEL = PurchasesModule.LOG_LEVEL;
  } catch (e) {
    console.warn("RevenueCat not available on this platform");
  }
}

export const useSubscription = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize RevenueCat only on native platforms
  useEffect(() => {
    const initializeRevenueCat = async () => {
      // Skip on web - users get free access
      if (Platform.OS === "web") {
        console.log("🌐 Web platform detected - granting free access");
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // Initialize RevenueCat on native platforms
      try {
        console.log("🔄 Initializing RevenueCat for native platform...");

        // Guard: Check if RevenueCat is available
        if (!Purchases || !LOG_LEVEL) {
          throw new Error("RevenueCat not available on this platform");
        }

        // Set debug logging level
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // Get appropriate API key based on platform
        if (Platform.OS === "ios") {
          const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
          if (!apiKey) {
            throw new Error(
              "iOS RevenueCat API key not found in environment variables"
            );
          }
          await Purchases.configure({ apiKey });
        } else if (Platform.OS === "android") {
          const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
          if (!apiKey) {
            throw new Error(
              "Android RevenueCat API key not found in environment variables"
            );
          }
          await Purchases.configure({ apiKey });
        }

        console.log("✅ RevenueCat initialized successfully");
        setIsInitialized(true);
      } catch (error) {
        console.error("❌ RevenueCat initialization failed:", error);
        Alert.alert(
          "Configuration Error",
          "Failed to initialize payment system. Please check your configuration."
        );
        // Don't grant access on mobile if initialization fails
        setHasAccess(false);
        setIsChecking(false);
      }
    };

    initializeRevenueCat();
  }, []);

  // Check subscription status (only on native platforms)
  useEffect(() => {
    if (!isInitialized || Platform.OS === "web") {
      return;
    }

    const checkSubscription = async () => {
      try {
        // Guard: Check if RevenueCat is available
        if (!Purchases) {
          throw new Error("RevenueCat not available");
        }

        console.log("🔄 Checking subscription status...");
        const customerInfo = await Purchases.getCustomerInfo();
        console.log("📋 Customer info:", customerInfo);

        const isPremium =
          customerInfo.entitlements.active["pos_light_pro"] !== undefined;

        if (isPremium) {
          console.log("✅ User has premium access");
          setHasAccess(true);
        } else {
          console.log("🔒 User needs to purchase");
          setHasAccess(false);
        }
      } catch (error) {
        console.error("❌ Error checking subscription status:", error);
        // If error, deny access to be safe
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSubscription();
  }, [isInitialized]);

  return {
    hasAccess,
    isChecking,
    shouldShowPaywall: shouldEnablePaywall() && !hasAccess && !isChecking,
    platform: Platform.OS,
  };
};

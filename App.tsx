import "./global.css";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, Alert } from "react-native";
import * as Sentry from "@sentry/react-native";
// Always import RevenueCat for real API usage
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// Sentry is initialized in sentry.config.js

// Test Sentry after a delay to ensure it's initialized
setTimeout(() => {
  try {
    const Sentry = require("@sentry/react-native");
    Sentry.captureMessage("🚀 App started successfully - Sentry is working!");
    console.log("✅ Sentry test message sent");
  } catch (error) {
    console.log("❌ Sentry test failed:", error);
  }
}, 3000);

// Disable console logs in production
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
  // Keep console.error for critical errors
}
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import MainLayout from "./components/layouts/MainLayout";
import LeftPanel from "./components/layouts/LeftPanel";
import RightPanel from "./components/layouts/RightPanel";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import { useTheme } from "./stores/themeStore";
import { useProductStore } from "./stores/productStore";
import LoginScreen from "./components/LoginScreen";
import LoadingScreen from "./components/LoadingScreen";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { toastConfig } from "./config/toastConfig";
import Header from "./components/Header";
// import { useDataSync } from "./hooks/useDataSync";
// import { useSyncQueueProcessor } from "./hooks/useSyncMutations";
import HistoryPanel from "./components/HistoryPanel";
import SettingsPanel from "./components/SettingsPanel";
import PaywallModal from "./components/PaywallModal";
import { useDrawerStore } from "./stores/drawerStore";
import { useMetricsStore } from "./stores/metricsStore";
import { loadStore } from "./services/tinybaseStore";

function AppContent() {
  // Get theme
  const { isDark } = useTheme();

  // No need for auth state in app lock mode

  // Get cart state for global selection clearing
  const { selectedProductForQuantity, setSelectedProductForQuantity } =
    useCartStore();

  // Clear product selection when tapping anywhere in the app
  const handleGlobalClearSelection = () => {
    if (selectedProductForQuantity) {
      console.log("🧹 Global clear selection");
      setSelectedProductForQuantity(null);
    }
  };

  // Get drawer state
  const {
    isSalesDrawerOpen,
    closeSalesDrawer,
    isSettingsDrawerOpen,
    closeSettingsDrawer,
  } = useDrawerStore();

  // Get metrics store
  // const { loadPersistedMetrics, recalculateFromLocalTransactions } = useMetricsStore();

  // Get product store
  const { initializeProducts } = useProductStore();

  // Store is already initialized in main App component

  // useDataSync(user?.id);
  // useSyncQueueProcessor(); // Start background sync processing

  return (
    <SafeAreaWrapper
      className={`flex-1 ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View className="flex-1">
        <Header />

        <MainLayout
          leftPanel={
            <TouchableWithoutFeedback onPress={handleGlobalClearSelection}>
              <View className="flex-1">
                <LeftPanel />
              </View>
            </TouchableWithoutFeedback>
          }
          rightPanel={<RightPanel />}
        />

        {/* Add History Panel */}
        <HistoryPanel
          isVisible={isSalesDrawerOpen}
          onClose={closeSalesDrawer}
        />

        {/* Add Settings Panel */}
        <SettingsPanel
          isVisible={isSettingsDrawerOpen}
          onClose={closeSettingsDrawer}
        />
      </View>

      <Toast config={toastConfig} />
    </SafeAreaWrapper>
  );
}

export default function App() {
  const { isUnlocked } = useAuthStore();
  const { isReady } = useAppInitialization();
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Initialize RevenueCat with real API keys
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        console.log("🔄 Initializing RevenueCat with real API keys...");

        // Set debug logging level
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // Use real API keys from environment variables
        if (Platform.OS === "ios") {
          const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
          if (!apiKey) {
            throw new Error(
              "iOS RevenueCat API key not found in environment variables"
            );
          }

          await Purchases.configure({
            apiKey: apiKey,
          });
        } else if (Platform.OS === "android") {
          const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
          if (!apiKey) {
            throw new Error(
              "Android RevenueCat API key not found in environment variables"
            );
          }

          await Purchases.configure({
            apiKey: apiKey,
          });
        }

        console.log("✅ RevenueCat initialized successfully with real API");
      } catch (error) {
        console.error("❌ RevenueCat initialization failed:", error);
        // Don't fall back to mock mode - show error
        Alert.alert(
          "Configuration Error",
          "Failed to initialize payment system. Please check your configuration."
        );
      }
    };

    initializeRevenueCat();
  }, []);

  // Check purchase status on app launch
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      try {
        console.log("🔄 Checking real purchase status...");
        const customerInfo = await Purchases.getCustomerInfo();
        console.log("📋 Customer info:", customerInfo);

        const isPremium =
          customerInfo.entitlements.active["pos_light_pro"] !== undefined;

        if (isPremium) {
          console.log("✅ User has premium access");
          setHasPurchased(true);
        } else {
          console.log("🔒 User needs to purchase - showing paywall");
          setShowPaywall(true);
        }
      } catch (error) {
        console.error("❌ Error checking purchase status:", error);
        // If error, show paywall to be safe
        setShowPaywall(true);
      }
    };

    if (isReady) {
      checkPurchaseStatus();
    }
  }, [isReady]);

  if (!isReady) {
    return <LoadingScreen />;
  }

  // Show paywall if user hasn't purchased
  if (!hasPurchased) {
    return (
      <PaywallModal
        isVisible={showPaywall}
        onClose={() => {
          // Don't allow closing without purchase
          console.log("Paywall cannot be closed without purchase");
        }}
        onPurchaseSuccess={() => {
          setHasPurchased(true);
          setShowPaywall(false);
        }}
      />
    );
  }

  if (!isUnlocked) {
    return <LoginScreen />;
  }

  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}

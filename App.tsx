import "./global.css";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
// Conditionally import RevenueCat to avoid errors in Expo Go
let Purchases: any = null;
let LOG_LEVEL: any = null;

try {
  const revenueCat = require("react-native-purchases");
  Purchases = revenueCat.default;
  LOG_LEVEL = revenueCat.LOG_LEVEL;
} catch (error) {
  console.log("RevenueCat not available in Expo Go - using mock mode");
}

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // Set tracesSampleRate to 1.0 to capture 100% of the transactions for performance monitoring.
  tracesSampleRate: 1.0,
});

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

  // Initialize RevenueCat (only if available)
  useEffect(() => {
    const initializeRevenueCat = async () => {
      if (!Purchases) {
        console.log("🔄 RevenueCat not available - using mock mode");
        return;
      }

      try {
        console.log("🔄 Initializing RevenueCat...");

        // Use real API keys from RevenueCat Dashboard
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey:
              process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ||
              "appl_dummy_key_for_preview",
          });
        } else if (Platform.OS === "android") {
          await Purchases.configure({
            apiKey:
              process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ||
              "goog_dummy_key_for_preview",
          });
        }

        console.log("✅ RevenueCat initialized successfully");
      } catch (error) {
        console.log(
          "⚠️ RevenueCat Preview Mode - using mock data (this is normal in Expo Go)"
        );
      }
    };

    initializeRevenueCat();
  }, []);

  // Check purchase status on app launch
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!Purchases) {
        // In mock mode, show paywall for testing
        console.log("Mock Mode: Showing paywall for testing");
        setShowPaywall(true);
        return;
      }

      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const isPremium =
          customerInfo.entitlements.active["pos_light_pro"] !== undefined;

        if (isPremium) {
          setHasPurchased(true);
        } else {
          setShowPaywall(true);
        }
      } catch (error) {
        console.log("Error checking purchase status:", error);
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

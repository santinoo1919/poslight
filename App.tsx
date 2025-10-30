import "./global.css";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
// Sentry disabled on web for now

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
import { useSubscription } from "./hooks/useSubscription";

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
  const { hasAccess, shouldShowPaywall, isChecking, platform } =
    useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  // Show loading while checking subscription status
  useEffect(() => {
    if (!isReady || isChecking) {
      return;
    }

    if (shouldShowPaywall) {
      setShowPaywall(true);
    } else {
      setShowPaywall(false);
    }
  }, [isReady, isChecking, shouldShowPaywall]);

  if (!isReady || isChecking) {
    return <LoadingScreen />;
  }

  // Show paywall if user hasn't purchased (only on native platforms)
  if (shouldShowPaywall && showPaywall) {
    return (
      <PaywallModal
        isVisible={true}
        onClose={() => {
          // Don't allow closing without purchase on native
          console.log("Paywall cannot be closed without purchase");
        }}
        onPurchaseSuccess={() => {
          // This will be handled by the hook
          setShowPaywall(false);
          console.log("✅ Purchase successful");
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

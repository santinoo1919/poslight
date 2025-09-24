import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
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
import SalesSidePanel from "./components/SalesSidePanel";
import SettingsPanel from "./components/SettingsPanel";
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

  console.log("🎨 App render - isDark:", isDark);

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

        {/* Add Sales Side Panel */}
        <SalesSidePanel
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

  if (!isReady) {
    return <LoadingScreen />;
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

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
import { useTheme } from "./stores/themeStore";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";
import LoginScreen from "./components/LoginScreen";
import { toastConfig } from "./config/toastConfig";
import Header from "./components/Header";
import { useDataSync } from "./hooks/useDataSync";
import { useSyncQueueProcessor } from "./hooks/useSyncMutations";
import SalesSidePanel from "./components/SalesSidePanel";
import { useDrawerStore } from "./stores/drawerStore";
import { useMetricsStore } from "./stores/metricsStore";
import { loadStore } from "./services/tinybaseStore";

function AppContent() {
  // Get theme
  const { isDark, loadTheme } = useTheme();

  // Get auth state for logout functionality
  const { signOut } = useAuthStore();

  const { user } = useAuthStore();

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
  const { isSalesDrawerOpen, closeSalesDrawer } = useDrawerStore();

  // Get metrics store
  const { loadPersistedMetrics, recalculateFromLocalTransactions } =
    useMetricsStore();

  // Initialize store FIRST, before any queries run
  React.useEffect(() => {
    const initializeStore = async () => {
      await loadStore();
      await loadTheme(); // Load theme after store
    };
    initializeStore();
  }, [loadTheme]);

  useDataSync(user?.id);
  useSyncQueueProcessor(); // Start background sync processing

  // Initialize metrics after store is loaded
  React.useEffect(() => {
    const initializeMetrics = async () => {
      await loadPersistedMetrics();
      recalculateFromLocalTransactions();
    };

    initializeMetrics();
  }, [loadPersistedMetrics, recalculateFromLocalTransactions]);

  return (
    <SafeAreaWrapper
      className={`flex-1 bg-background-light dark:bg-background-dark ${isDark ? "dark" : ""}`}
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
      </View>

      <Toast config={toastConfig} />
    </SafeAreaWrapper>
  );
}

export default function App() {
  const { user, loading, checkSession } = useAuthStore();

  React.useEffect(() => {
    checkSession();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}

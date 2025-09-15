import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import MainLayout from "./components/layouts/MainLayout";
import LeftPanel from "./components/layouts/LeftPanel";
import RightPanel from "./components/layouts/RightPanel";
import Toast from "react-native-toast-message";

import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useProductStore } from "./stores/productStore";
import { useCartStore } from "./stores/cartStore";
import { useMetricsStore } from "./stores/metricsStore";
import { useTheme } from "./stores/themeStore";
import { useProductsQuery } from "./hooks/useProductsQuery";
import { useCategoriesQuery } from "./hooks/useCategoriesQuery";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./stores/authStore";
import LoginScreen from "./components/LoginScreen";
import ThemeToggle from "./components/ThemeToggle";
import { toastConfig } from "./config/toastConfig";

function AppContent() {
  // Get theme
  const { isDark, loadTheme } = useTheme();

  const { data: products, isLoading: loading, error } = useProductsQuery();
  const { data: categories } = useCategoriesQuery();

  // Load saved theme on app start
  React.useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Get product state from Zustand store
  const { setProducts, setCategories, setLoading, setError } =
    useProductStore();

  // Get metrics from metrics store
  const { dailyRevenue, dailyProfit } = useMetricsStore();

  // Get auth state for logout functionality
  const { signOut } = useAuthStore();

  // Sync Supabase data to Zustand store
  React.useEffect(() => {
    console.log("🔄 App: Syncing Supabase data to Zustand", {
      productsLength: products?.length || 0,
      categoriesLength: categories?.length || 0,
      loading,
      error,
    });

    // Only set products/categories when they actually exist
    if (products) {
      setProducts(products);
    }
    if (categories) {
      setCategories(categories);
    }
    setLoading(loading);
    setError(error?.message || null);
  }, [
    products,
    categories,
    loading,
    error,
    setProducts,
    setCategories,
    setLoading,
    setError,
  ]);

  return (
    <SafeAreaWrapper
      className={`flex-1 bg-background-light dark:bg-background-dark ${isDark ? "dark" : ""}`}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header - Sticky and Reduced Height */}
      <View className="bg-surface-light dark:bg-surface-dark pt-4 pb-3 px-4 border-b border-border-light dark:border-border-dark sticky top-0 z-10">
        <View className="flex-row items-center justify-between">
          {/* Left side - Empty space to balance layout */}
          <View className="w-40" />

          {/* Centered title and subtitle */}
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-text-primary dark:text-text-inverse text-center">
              POS Light
            </Text>
            <Text className="text-text-secondary dark:text-text-muted mt-1 text-sm text-center">
              Simple • Fast • Offline
            </Text>
          </View>

          {/* Right side - Daily metrics, theme toggle and logout button */}
          <View className="flex-shrink-0 flex-row items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle size="small" showIcon={false} />

            <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2">
              <View className="flex-row items-center space-x-3">
                <View className="items-center">
                  <Text className="text-xs text-text-secondary dark:text-text-muted">
                    Today's Revenue
                  </Text>
                  <Text className="text-sm font-bold text-state-success dark:text-state-successDark">
                    €{dailyRevenue.toFixed(2)}
                  </Text>
                </View>
                <View className="w-px h-8 bg-border-muted dark:bg-border-dark"></View>
                <View className="items-center">
                  <Text className="text-xs text-text-secondary dark:text-text-muted">
                    Today's Profit
                  </Text>
                  <Text className="text-sm font-bold text-brand-primary dark:text-brand-primaryDark">
                    €{dailyProfit.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={signOut}
              className="bg-interactive-disabled dark:bg-interactive-disabledDark px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <MainLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />

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

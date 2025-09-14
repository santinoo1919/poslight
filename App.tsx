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
import useTinyBase from "./hooks/useTinyBase";
import { useAuthStore } from "./stores/authStore";
import LoginScreen from "./components/LoginScreen";

function AppContent() {
  // Get data from TinyBase hook
  const { products, categories, loading, error, resetProducts } = useTinyBase();

  // Get product state from Zustand store
  const { setProducts, setCategories, setLoading, setError } =
    useProductStore();

  // Get metrics from metrics store
  const { dailyRevenue, dailyProfit } = useMetricsStore();

  // Get auth state for logout functionality
  const { signOut } = useAuthStore();

  // Sync TinyBase data to Zustand store
  React.useEffect(() => {
    console.log("🔄 App: Syncing TinyBase data to Zustand", {
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
    setError(error);
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
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Header - Sticky and Reduced Height */}
      <View className="bg-gray-50 pt-4 pb-3 px-4 border-b border-gray-200 sticky top-0 z-10">
        <View className="flex-row items-center justify-between">
          {/* Left side - Empty space to balance layout */}
          <View className="w-40" />

          {/* Centered title and subtitle */}
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-gray-800 text-center">
              POS Light
            </Text>
            <Text className="text-gray-500 mt-1 text-sm text-center">
              Simple • Fast • Offline
            </Text>
          </View>

          {/* Right side - Daily metrics and logout button */}
          <View className="flex-shrink-0 flex-row items-center space-x-3">
            <View className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg px-3 py-2">
              <View className="flex-row items-center space-x-3">
                <View className="items-center">
                  <Text className="text-xs text-gray-600">Today's Revenue</Text>
                  <Text className="text-sm font-bold text-green-600">
                    €{dailyRevenue.toFixed(2)}
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-300"></View>
                <View className="items-center">
                  <Text className="text-xs text-gray-600">Today's Profit</Text>
                  <Text className="text-sm font-bold text-blue-600">
                    €{dailyProfit.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={signOut}
              className="bg-gray-400 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <MainLayout leftPanel={<LeftPanel />} rightPanel={<RightPanel />} />

      <Toast />
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
  return <AppContent />;
}

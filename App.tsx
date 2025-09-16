import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import MainLayout from "./components/layouts/MainLayout";
import LeftPanel from "./components/layouts/LeftPanel";
import RightPanel from "./components/layouts/RightPanel";
import Toast from "react-native-toast-message";

import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "./stores/themeStore";
import { QueryProvider } from "./providers/QueryProvider";
import { useAuthStore } from "./stores/authStore";
import LoginScreen from "./components/LoginScreen";
import { toastConfig } from "./config/toastConfig";
import Header from "./components/Header";
import { useDataSync } from "./hooks/useDataSync";

function AppContent() {
  // Get theme
  const { isDark, loadTheme } = useTheme();

  // Load saved theme on app start
  React.useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  // Get auth state for logout functionality
  const { signOut } = useAuthStore();

  const { user } = useAuthStore();

  useDataSync(user?.id);

  return (
    <SafeAreaWrapper
      className={`flex-1 bg-background-light dark:bg-background-dark ${isDark ? "dark" : ""}`}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Header />

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

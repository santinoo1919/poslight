// components/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../stores/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp, loading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    await signIn(email, password);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    await signUp(email, password);
  };

  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark px-6">
      <View className="w-full max-w-md bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg p-8 border border-border-light dark:border-border-dark">
        {/* Header matching POS style */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-text-primary dark:text-text-inverse text-center">
            POS Light
          </Text>
          <Text className="text-text-secondary dark:text-text-muted mt-2 text-sm text-center">
            Simple • Fast • Offline
          </Text>
        </View>

        <Text className="text-lg text-center mb-8 text-text-primary dark:text-text-inverse font-medium">
          Please login to continue
        </Text>

        {error && (
          <View className="bg-state-error dark:bg-state-errorDark bg-opacity-10 border border-state-error dark:border-state-errorDark px-4 py-3 rounded-lg mb-4">
            <Text className="text-state-error dark:text-state-errorDark text-sm">
              {error}
            </Text>
            <TouchableOpacity onPress={clearError} className="mt-2">
              <Text className="text-state-error dark:text-state-errorDark underline text-sm">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          className="border border-border-light dark:border-border-dark rounded-lg px-4 py-3 mb-4 bg-background-light dark:bg-background-dark text-text-primary dark:text-text-inverse"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-border-light dark:border-border-dark rounded-lg px-4 py-3 mb-6 bg-background-light dark:bg-background-dark text-text-primary dark:text-text-inverse"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-brand-primary dark:bg-brand-primaryDark py-3 rounded-lg mb-3 active:bg-blue-600"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className="bg-interactive-disabled dark:bg-interactive-disabledDark py-3 rounded-lg active:bg-gray-700"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

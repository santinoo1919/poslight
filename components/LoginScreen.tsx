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
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <View className="w-full max-w-md">
        <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
          POS Light
        </Text>

        <Text className="text-lg text-center mb-8 text-gray-600">
          Please login to continue
        </Text>

        {error && (
          <View className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <Text className="text-red-700">{error}</Text>
            <TouchableOpacity onPress={clearError} className="mt-2">
              <Text className="text-red-600 underline">Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-white"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-500 py-3 rounded-lg mb-3"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className="bg-gray-500 py-3 rounded-lg"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

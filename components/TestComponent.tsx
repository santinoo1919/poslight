import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function TestComponent() {
  return (
    <View className="p-4 bg-background-light dark:bg-background-dark rounded-lg m-4">
      <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse mb-2">
        NativeWind Test
      </Text>
      <Text className="text-text-secondary dark:text-text-muted mb-4">
        If you can see this styled text, NativeWind is working!
      </Text>
      <TouchableOpacity className="bg-brand-primary dark:bg-brand-primaryDark px-4 py-2 rounded-md">
        <Text className="text-white font-medium text-center">Test Button</Text>
      </TouchableOpacity>
    </View>
  );
}

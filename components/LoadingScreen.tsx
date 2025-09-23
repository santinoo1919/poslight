import React from "react";
import { View, Image } from "react-native";
import { useTheme } from "../stores/themeStore";

export default function LoadingScreen() {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-1 justify-center items-center ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      <Image
        source={require("../assets/icon.png")}
        className="w-20 h-20 rounded-2xl"
      />
    </View>
  );
}

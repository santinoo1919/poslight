import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../stores/themeStore";

export default function SafeAreaWrapper({ children, className }) {
  const { isDark } = useTheme();

  // On web, use React Native View without padding (header will handle spacing)
  if (Platform.OS === "web") {
    return (
      <View
        className={`${className} ${isDark ? "bg-background-dark" : "bg-background-light"}`}
      >
        {children}
      </View>
    );
  }

  // On mobile, use SafeAreaView
  return (
    <SafeAreaView
      className={`${className} ${isDark ? "bg-background-dark" : "bg-background-light"}`}
    >
      {children}
    </SafeAreaView>
  );
}

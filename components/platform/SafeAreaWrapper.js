import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeAreaWrapper({ children, className }) {
  // On web, use React Native View without padding (header will handle spacing)
  if (Platform.OS === "web") {
    return <View className={className}>{children}</View>;
  }

  // On mobile, use SafeAreaView
  return <SafeAreaView className={className}>{children}</SafeAreaView>;
}

import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeAreaWrapper({ children, className }) {
  // On web, use React Native View with padding
  if (Platform.OS === "web") {
    return (
      <View className={className} style={{ paddingTop: 20, paddingBottom: 20 }}>
        {children}
      </View>
    );
  }

  // On mobile, use SafeAreaView
  return <SafeAreaView className={className}>{children}</SafeAreaView>;
}

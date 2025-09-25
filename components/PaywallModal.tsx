// components/PaywallModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// Conditionally import RevenueCat
let Purchases: any = null;
try {
  Purchases = require("react-native-purchases").default;
} catch (error) {
  console.log("RevenueCat not available - using mock mode");
}
import { useTheme } from "../stores/themeStore";

interface PaywallModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

export default function PaywallModal({
  isVisible,
  onClose,
  onPurchaseSuccess,
}: PaywallModalProps) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<any>(null);

  useEffect(() => {
    if (isVisible) {
      checkSubscriptionStatus();
    }
  }, [isVisible]);

  const checkSubscriptionStatus = async () => {
    if (!Purchases) {
      console.log("Mock Mode: Using mock customer info");
      setCustomerInfo({
        entitlements: {
          active: {},
        },
      });
      return;
    }

    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (error) {
      console.log("Preview Mode: Using mock customer info");
      // Mock data for Preview Mode
      setCustomerInfo({
        entitlements: {
          active: {},
        },
      });
    }
  };

  const handlePurchase = async () => {
    setIsLoading(true);

    if (!Purchases) {
      // Mock purchase in Expo Go
      console.log("Mock Mode: Simulating successful purchase");
      Alert.alert(
        "Mock Mode",
        "This is a demo purchase. In production, this would be a real purchase!"
      );
      onPurchaseSuccess();
      setIsLoading(false);
      return;
    }

    try {
      // In preview mode, this will use mock data
      const offerings = await Purchases.getOfferings();

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const packageToPurchase = offerings.current.availablePackages[0];
        const { customerInfo } =
          await Purchases.purchasePackage(packageToPurchase);

        if (customerInfo.entitlements.active["pos_light_pro"]) {
          Alert.alert("Success!", "You now have access to premium features!");
          onPurchaseSuccess();
        }
      } else {
        Alert.alert("No Products", "No products available for purchase");
      }
    } catch (error: any) {
      if (error.code === "USER_CANCELLED") {
        console.log("User cancelled purchase");
      } else {
        console.log("Preview Mode: Simulating successful purchase");
        // Simulate successful purchase in Preview Mode
        Alert.alert(
          "Preview Mode",
          "This is a demo purchase. In production, this would be a real purchase!"
        );
        onPurchaseSuccess();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubscribed = customerInfo?.entitlements?.active?.pos_light_pro;

  if (isSubscribed) {
    return (
      <Modal visible={isVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View
            className={`mx-6 p-6 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <Text
              className={`text-xl font-bold text-center mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              🎉 You're Premium!
            </Text>
            <Text
              className={`text-center mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              You have access to all premium features.
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className={`py-3 px-6 rounded-lg ${isDark ? "bg-blue-600" : "bg-blue-500"}`}
            >
              <Text className="text-white text-center font-semibold">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View
          className={`mx-6 p-6 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
        >
          <View className="items-center mb-6">
            <Ionicons name="star" size={48} color="#FFD700" />
            <Text
              className={`text-2xl font-bold mt-4 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              POS Light Pro
            </Text>
            <Text
              className={`text-center mt-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Simple, fast, offline-first POS system. No complexity, just cash
              and run.
            </Text>
          </View>

          <View className="space-y-3 mb-6">
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text
                className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Complete offline functionality
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text
                className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Local data backup & restore
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text
                className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Beautiful, intuitive interface
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text
                className={`ml-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                No monthly fees, one-time purchase
              </Text>
            </View>
          </View>

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handlePurchase}
              disabled={isLoading}
              className={`py-4 rounded-lg ${isDark ? "bg-blue-600" : "bg-blue-500"} ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Buy POS Light Pro - $9.99
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

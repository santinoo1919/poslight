// components/ProductCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform, Image } from "react-native";
import * as Haptics from "expo-haptics";
import type {
  ProductCardProps,
  ProductWithInventory,
} from "../types/components";
import { getProfitTextColor } from "../utils/profitLevels";
import { useProductCardData } from "../hooks/useProductCardData";
import { ToastService } from "../services/toastService";
import { useTheme } from "../stores/themeStore";
import { getResponsiveFontSize } from "../utils/responsive";

export default function ProductCard({
  product,
  inventory,
  onPress,
  isSelected = false,
}: ProductCardProps & { isSelected?: boolean }) {
  const { isDark } = useTheme();
  const {
    stock,
    isLowStock,
    isOutOfStock,
    buyPrice,
    sellPrice,
    profit,
    profitLevel,
  } = useProductCardData(product, inventory);

  const handleProductPress = () => {
    const stock = inventory?.stock ?? 0;

    if (stock === 0) {
      // Light haptic for error state
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      ToastService.stock.insufficient(product.name, 1, 0);
      return;
    }

    if (stock <= 10) {
      // Warning haptic for low stock
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      ToastService.stock.lowStock(product.name, stock);
    } else {
      // Success haptic for product selection
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Use the onPress prop to trigger the keypad flow
    if (onPress) {
      onPress({ ...product, inventory });
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-lg border p-3 flex-1 ${
        isOutOfStock
          ? `${isDark ? "bg-interactive-disabledDark border-border-dark" : "bg-interactive-disabled border-border-muted"} opacity-50`
          : isSelected
            ? `${isDark ? "bg-interactive-selectedDark border-brand-primaryDark" : "bg-interactive-selected border-brand-primary"}`
            : `${isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light"}`
      }`}
      onPress={isOutOfStock ? undefined : handleProductPress}
      activeOpacity={isOutOfStock ? 1 : Platform.OS === "ios" ? 0.7 : 1}
      disabled={isOutOfStock}
    >
      {/* Category Badge */}
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: product.color || "#3B82F6" }}
        >
          <Text className="text-white text-xs font-medium">
            {product.icon || "📦"}
          </Text>
        </View>
        <Text
          className={`text-xs ${isDark ? "text-text-secondary" : "text-text-muted"}`}
        >
          #{product.sku}
        </Text>
      </View>

      {/* Product Image */}
      <View
        className={`w-full aspect-[3/2] ${isDark ? "bg-background-dark" : "bg-background-light"} rounded-md mb-2 items-center justify-center overflow-hidden`}
      >
        <Image
          source={require("../assets/sicam.png")}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          resizeMode="contain"
        />
      </View>

      {/* Product Name */}
      <Text
        className={`font-semibold mb-1 ${getResponsiveFontSize("text-sm")} ${
          isOutOfStock
            ? `${isDark ? "text-text-muted" : "text-text-secondary"}`
            : `${isDark ? "text-text-inverse" : "text-text-primary"}`
        }`}
        numberOfLines={2}
      >
        {product.name}
      </Text>

      {/* Price Layout */}
      <View className="mb-1 space-y-1">
        {/* Top row: Sell Price + Profit */}
        <View className="flex-row justify-between items-center">
          <Text
            className={`font-bold ${getResponsiveFontSize("text-base")} ${
              isOutOfStock
                ? `${isDark ? "text-text-muted" : "text-text-secondary"}`
                : `${isDark ? "text-state-successDark" : "text-state-success"}`
            }`}
          >
            €{sellPrice.toFixed(2)}
          </Text>
          <Text
            className={`font-medium ${getResponsiveFontSize("text-sm")} ${
              isOutOfStock
                ? `${isDark ? "text-text-muted" : "text-text-secondary"}`
                : getProfitTextColor(profitLevel)
            }`}
          >
            +€{profit.toFixed(2)}
          </Text>
        </View>

        {/* Bottom row: Buy Price + Stock */}
        <View className="flex-row justify-between items-center">
          <Text
            className={`${getResponsiveFontSize("text-sm")} ${isDark ? "text-text-muted" : "text-text-secondary"}`}
          >
            €{buyPrice.toFixed(2)}
          </Text>
          <Text
            className={`font-medium ${getResponsiveFontSize("text-sm")} ${
              isOutOfStock
                ? `${isDark ? "text-state-errorDark" : "text-state-error"}`
                : isLowStock
                  ? `${isDark ? "text-state-errorDark" : "text-state-error"}`
                  : `${isDark ? "text-text-muted" : "text-text-secondary"}`
            }`}
          >
            {isLowStock && !isOutOfStock && "⚠️ "}Stock: {stock}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

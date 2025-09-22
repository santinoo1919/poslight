import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { CartProduct, ProductWithInventory } from "../types/components";
import { useTheme } from "../stores/themeStore";

interface CartItemCardProps {
  product: CartProduct;
  selectedItem?: ProductWithInventory | null;
  onRemove: (productId: string) => void;
  onEdit: (product: ProductWithInventory) => void;
}

export default function CartItemCard({
  product,
  selectedItem,
  onRemove,
  onEdit,
}: CartItemCardProps) {
  const { isDark } = useTheme();
  const isSelected = selectedItem?.id === product.id;

  return (
    <View
      className={`${isDark ? "bg-background-dark" : "bg-background-light"} rounded-lg p-3 border mb-2 ${
        isSelected
          ? `${isDark ? "border-blue-400" : "border-blue-500"}`
          : `${isDark ? "border-border-dark" : "border-border-light"}`
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`font-medium ${isDark ? "text-text-inverse" : "text-text-primary"} text-sm`}
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onRemove(product.id);
          }}
          className="p-1"
        >
          <Ionicons
            name="close-outline"
            size={20}
            color={isDark ? "#ef4444" : "#dc2626"}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <Text
          className={`${isDark ? "text-text-muted" : "text-text-secondary"} text-sm`}
        >
          €{(product.inventory?.sell_price || product.price || 0).toFixed(2)} ×{" "}
          {product.quantity}
        </Text>
        <Text
          className={`font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"}`}
        >
          €
          {(
            (product.inventory?.sell_price || product.price || 0) *
            product.quantity
          ).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text
          className={`text-xs ${isDark ? "text-text-muted" : "text-text-secondary"}`}
        >
          Stock: {product.inventory?.stock}
        </Text>
        <TouchableOpacity
          onPress={() => onEdit(product)}
          className={`${isDark ? "bg-background-dark border-border-dark" : "bg-background-light border-border-light"} border px-2 py-1 rounded`}
        >
          <Text
            className={`${isDark ? "text-text-inverse" : "text-text-primary"} text-xs`}
          >
            Edit Qty
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

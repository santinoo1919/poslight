import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { CartProduct, ProductWithInventory } from "../types/components";

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
  const isSelected = selectedItem?.id === product.id;

  return (
    <View
      className={`bg-background-light dark:bg-background-dark rounded-lg p-3 border ${
        isSelected
          ? "border-blue-500 dark:border-blue-400"
          : "border-border-light dark:border-border-dark"
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="font-medium text-text-primary dark:text-text-inverse text-sm"
          numberOfLines={1}
        >
          {product.name}
        </Text>
        <TouchableOpacity onPress={() => onRemove(product.id)} className="p-1">
          <Text className="text-state-error dark:text-state-errorDark text-lg">
            ×
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-text-secondary dark:text-text-muted text-sm">
          €{product.inventory?.sell_price.toFixed(2)} × {product.quantity}
        </Text>
        <Text className="font-semibold text-text-primary dark:text-text-inverse">
          €
          {((product.inventory?.sell_price || 0) * product.quantity).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-xs text-text-secondary dark:text-text-muted">
          Stock: {product.inventory?.stock}
        </Text>
        <TouchableOpacity
          onPress={() => onEdit(product)}
          className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-2 py-1 rounded"
        >
          <Text className="text-text-primary dark:text-text-inverse text-xs">
            Edit Qty
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

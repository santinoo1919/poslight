import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { CartProduct, ProductWithInventory } from "../types/components";

interface StockItemCardProps {
  product: CartProduct;
  selectedItem?: ProductWithInventory | null;
  onRemove: (productId: string) => void;
  onEdit: (product: ProductWithInventory) => void;
}

export default function StockItemCard({
  product,
  selectedItem,
  onRemove,
  onEdit,
}: StockItemCardProps) {
  const isSelected = selectedItem?.id === product.id;

  return (
    <View
      className={`bg-background-light dark:bg-background-dark rounded-lg p-3 border mb-2 ${
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
          Current: {product.inventory?.stock}
        </Text>
        <Text className="font-semibold text-text-primary dark:text-text-inverse">
          +{product.quantity} ={" "}
          {(product.inventory?.stock || 0) + product.quantity}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <Text className="text-xs text-text-secondary dark:text-text-muted">
          Buy: €{product.inventory?.buy_price?.toFixed(2)}
        </Text>
        <TouchableOpacity
          onPress={() => onEdit(product)}
          className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-2 py-1 rounded"
        >
          <Text className="text-text-primary dark:text-text-inverse text-xs">
            Edit Stock
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

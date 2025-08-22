import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Keypad from "../Keypad";
import DailyMetricsCard from "../DailyMetricsCard";
import type { Product } from "../../types/database";

interface CartProduct extends Product {
  quantity: number;
}

interface RightPanelProps {
  selectedProducts: CartProduct[];
  selectedProductForQuantity: Product | null;
  keypadInput: string;
  dailyRevenue: number;
  dailyProfit: number;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onSetSelectedProductForQuantity: (product: Product | null) => void;
  onSetKeypadInput: React.Dispatch<React.SetStateAction<string>>;
  onKeypadNumber: (num: string) => void;
  onKeypadDelete: () => void;
  onKeypadClear: () => void;
  onKeypadEnter: () => void;
  onCompleteSale: () => void;
  getTotalAmount: () => number;
}

export default function RightPanel({
  selectedProducts,
  selectedProductForQuantity,
  keypadInput,
  dailyRevenue,
  dailyProfit,
  onRemoveFromCart,
  onUpdateQuantity,
  onSetSelectedProductForQuantity,
  onSetKeypadInput,
  onKeypadNumber,
  onKeypadDelete,
  onKeypadClear,
  onKeypadEnter,
  onCompleteSale,
  getTotalAmount,
}: RightPanelProps) {
  return (
    <>
      {/* POS Interface - Cart */}
      <View className="flex-1 p-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          🛒 Cart ({selectedProducts.length} items)
        </Text>

        {/* Keypad Section */}
        <View className="mb-4">
          {selectedProductForQuantity && (
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
              <Text className="text-sm font-medium text-blue-800 text-center">
                Setting quantity for: {selectedProductForQuantity.name}
              </Text>
              <Text className="text-lg font-bold text-blue-900 text-center mt-1">
                {keypadInput || "0"}
              </Text>
              <Text className="text-xs text-blue-700 text-center mt-1">
                Available Stock: {selectedProductForQuantity.stock}
              </Text>
            </View>
          )}

          <Keypad
            onNumberPress={onKeypadNumber}
            onDelete={onKeypadDelete}
            onClear={onKeypadClear}
            onEnter={onKeypadEnter}
            disabled={!selectedProductForQuantity}
          />
        </View>

        {selectedProducts.length === 0 ? (
          <View className="bg-gray-50 rounded-lg p-4">
            <Text className="text-gray-600 text-center">
              No products selected
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-2">
              Tap products to add to cart
            </Text>
          </View>
        ) : (
          <View className="flex-1 flex-col">
            {/* Cart Items - Scrollable */}
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="space-y-3">
                {selectedProducts.map((product) => (
                  <View
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text
                        className="font-medium text-gray-800 text-sm"
                        numberOfLines={1}
                      >
                        {product.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onRemoveFromCart(product.id)}
                        className="p-1"
                      >
                        <Text className="text-red-500 text-lg">×</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-600 text-sm">
                        €{product.sellPrice.toFixed(2)} × {product.quantity}
                      </Text>
                      <Text className="font-semibold text-gray-800">
                        €{(product.sellPrice * product.quantity).toFixed(2)}
                      </Text>
                    </View>

                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-xs text-gray-500">
                        Stock: {product.stock}
                      </Text>
                      <TouchableOpacity
                        onPress={() => onSetSelectedProductForQuantity(product)}
                        className="bg-blue-100 px-2 py-1 rounded"
                      >
                        <Text className="text-blue-600 text-xs">Edit Qty</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Cart Total and Actions */}
            <View className="border-t border-gray-200 pt-4 mt-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  Total:
                </Text>
                <Text className="text-xl font-bold text-gray-800">
                  €{getTotalAmount().toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onCompleteSale}
                className="bg-green-500 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Complete Sale
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Daily Metrics */}
      <View className="p-4 border-t border-gray-200">
        <DailyMetricsCard
          dailyRevenue={dailyRevenue}
          dailyProfit={dailyProfit}
        />
      </View>
    </>
  );
}

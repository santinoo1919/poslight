import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Keypad from "../Keypad";
import type { Product, CartProduct } from "../../types/components";
import { useCartStore } from "../../stores/cartStore";
import { useCartOperations } from "../../hooks/useCartOperations";
import { useStockOperations } from "../../hooks/useStockOperations";

export default function RightPanel() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"cart" | "stock">("cart");

  // Get cart state from Zustand store
  const {
    selectedProducts,
    selectedProductForQuantity,
    keypadInput,
    removeFromCart,
    updateQuantity,
    setSelectedProductForQuantity,
    setKeypadInput,
    handleKeypadNumber,
    handleKeypadDelete,
    handleKeypadClear,
    handleKeypadEnter,
  } = useCartStore();

  // Custom hooks for operations
  const { handleCompleteSale, getTotalAmount } = useCartOperations();
  const { handleUpdateStock } = useStockOperations();

  return (
    <>
      {/* Tab Header */}
      <View className="flex-row bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
        <TouchableOpacity
          onPress={() => setActiveTab("cart")}
          className={`flex-1 py-3 px-4 ${
            activeTab === "cart"
              ? "bg-surface-light dark:bg-surface-dark border-b-2 border-state-success dark:border-state-successDark"
              : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "cart"
                ? "text-text-primary dark:text-text-inverse"
                : "text-text-secondary dark:text-text-muted"
            }`}
          >
            🛒 Cart ({selectedProducts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("stock")}
          className={`flex-1 py-3 px-4 ${
            activeTab === "stock"
              ? "bg-surface-light dark:bg-surface-dark border-b-2 border-state-success dark:border-state-successDark"
              : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "stock"
                ? "text-text-primary dark:text-text-inverse"
                : "text-text-secondary dark:text-text-muted"
            }`}
          >
            📦 Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View className="flex-1 p-4 bg-surface-light dark:bg-surface-dark">
        {activeTab === "cart" ? (
          <>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse mb-4">
              Cart ({selectedProducts.length} items)
            </Text>

            {/* Keypad Section */}
            <View className="mb-4">
              {selectedProductForQuantity && (
                <View className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-3 mb-3">
                  <Text className="text-sm font-medium text-text-primary dark:text-text-inverse text-center">
                    Setting quantity for: {selectedProductForQuantity.name}
                  </Text>
                  <Text className="text-lg font-bold text-text-primary dark:text-text-inverse text-center mt-1">
                    {keypadInput || "0"}
                  </Text>
                  <Text className="text-xs text-text-secondary dark:text-text-muted text-center mt-1">
                    Available Stock:{" "}
                    {selectedProductForQuantity.inventory?.stock ?? 0}
                  </Text>
                </View>
              )}

              <Keypad
                onNumberPress={handleKeypadNumber}
                onDelete={handleKeypadDelete}
                onClear={handleKeypadClear}
                onEnter={handleKeypadEnter}
                disabled={!selectedProductForQuantity}
              />
            </View>

            {selectedProducts.length === 0 ? (
              <View className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                <Text className="text-text-secondary dark:text-text-muted text-center">
                  No products selected
                </Text>
                <Text className="text-text-muted dark:text-text-secondary text-xs text-center mt-2">
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
                        className="bg-background-light dark:bg-background-dark rounded-lg p-3 border border-border-light dark:border-border-dark"
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text
                            className="font-medium text-text-primary dark:text-text-inverse text-sm"
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeFromCart(product.id)}
                            className="p-1"
                          >
                            <Text className="text-state-error dark:text-state-errorDark text-lg">
                              ×
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-between">
                          <Text className="text-text-secondary dark:text-text-muted text-sm">
                            €{product.inventory?.sell_price.toFixed(2)} ×{" "}
                            {product.quantity}
                          </Text>
                          <Text className="font-semibold text-text-primary dark:text-text-inverse">
                            €
                            {(
                              product.inventory?.sell_price * product.quantity
                            ).toFixed(2)}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                          <Text className="text-xs text-text-secondary dark:text-text-muted">
                            Stock: {product.inventory?.stock}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedProductForQuantity(product)
                            }
                            className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-2 py-1 rounded"
                          >
                            <Text className="text-text-primary dark:text-text-inverse text-xs">
                              Edit Qty
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Cart Total and Actions */}
                <View className="border-t border-border-light dark:border-border-dark pt-4 mt-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse">
                      Total:
                    </Text>
                    <Text className="text-xl font-bold text-text-primary dark:text-text-inverse">
                      €{getTotalAmount().toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={handleCompleteSale}
                    className="bg-state-success dark:bg-state-successDark py-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Complete Sale
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            <Text className="text-lg font-semibold text-text-primary dark:text-text-inverse mb-4">
              Stock Management
            </Text>

            {/* Keypad Section for Stock */}
            <View className="mb-4">
              {selectedProductForQuantity && (
                <View className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-3 mb-3">
                  <Text className="text-sm font-medium text-text-primary dark:text-text-inverse text-center">
                    Adding stock to: {selectedProductForQuantity.name}
                  </Text>
                  <Text className="text-lg font-bold text-text-primary dark:text-text-inverse text-center mt-1">
                    +{keypadInput || "0"}
                  </Text>
                  <Text className="text-xs text-text-secondary dark:text-text-muted text-center mt-1">
                    Current: {selectedProductForQuantity.inventory?.stock ?? 0}{" "}
                    → New:{" "}
                    {(selectedProductForQuantity.inventory?.stock ?? 0) +
                      parseInt(keypadInput || "0")}
                  </Text>
                </View>
              )}

              <Keypad
                onNumberPress={handleKeypadNumber}
                onDelete={handleKeypadDelete}
                onClear={handleKeypadClear}
                onEnter={handleKeypadEnter}
                disabled={!selectedProductForQuantity}
              />
            </View>

            {selectedProducts.length === 0 ? (
              <View className="bg-background-light dark:bg-background-dark rounded-lg p-4">
                <Text className="text-text-secondary dark:text-text-muted text-center">
                  No products selected for stock update
                </Text>
                <Text className="text-text-muted dark:text-text-secondary text-xs text-center mt-2">
                  Tap products to update stock
                </Text>
              </View>
            ) : (
              <View className="flex-1 flex-col">
                {/* Stock Items - Scrollable */}
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <View className="space-y-3">
                    {selectedProducts.map((product) => (
                      <View
                        key={product.id}
                        className="bg-background-light dark:bg-background-dark rounded-lg p-3 border border-border-light dark:border-border-dark"
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text
                            className="font-medium text-text-primary dark:text-text-inverse text-sm"
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>
                          <TouchableOpacity
                            onPress={() => removeFromCart(product.id)}
                            className="p-1"
                          >
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
                            {product.inventory?.stock + product.quantity}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                          <Text className="text-xs text-text-secondary dark:text-text-muted">
                            Buy: €{product.inventory?.buy_price?.toFixed(2)}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              setSelectedProductForQuantity(product)
                            }
                            className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-2 py-1 rounded"
                          >
                            <Text className="text-text-primary dark:text-text-inverse text-xs">
                              Edit Stock
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Stock Update Action */}
                <View className="border-t border-border-light dark:border-border-dark pt-4 mt-4">
                  <TouchableOpacity
                    onPress={handleUpdateStock}
                    className="bg-state-success dark:bg-state-successDark py-3 rounded-lg"
                  >
                    <Text className="text-white text-center font-semibold text-lg">
                      Add Stock
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
}

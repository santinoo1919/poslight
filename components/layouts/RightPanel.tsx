import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Keypad from "../Keypad";
import ActionCTA from "../ActionCTA";
import ItemList from "../ItemList";
import CartItemCard from "../CartItemCard";
import StockItemCard from "../StockItemCard";
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

            <View className="flex-1 flex-col">
              {/* Cart Items - Using ItemList */}
              <ItemList
                items={selectedProducts}
                renderItem={(product) => (
                  <CartItemCard
                    product={product}
                    selectedItem={selectedProductForQuantity}
                    onRemove={removeFromCart}
                    onEdit={setSelectedProductForQuantity}
                  />
                )}
                emptyState={{
                  title: "No products selected",
                  subtitle: "Tap products to add to cart",
                }}
                className="flex-1"
              />

              {/* Cart CTA */}
              <View className="border-t border-border-light dark:border-border-dark pt-4 mt-4">
                <ActionCTA
                  onPress={handleCompleteSale}
                  totalAmount={getTotalAmount()}
                  itemCount={selectedProducts.length}
                  disabled={selectedProducts.length === 0}
                  mode="cart"
                />
              </View>
            </View>
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

            <View className="flex-1 flex-col">
              {/* Stock Items - Using ItemList */}
              <ItemList
                items={selectedProducts}
                renderItem={(product) => (
                  <StockItemCard
                    product={product}
                    selectedItem={selectedProductForQuantity}
                    onRemove={removeFromCart}
                    onEdit={setSelectedProductForQuantity}
                  />
                )}
                emptyState={{
                  title: "No products selected for stock update",
                  subtitle: "Tap products to update stock",
                }}
                className="flex-1"
              />

              {/* Stock CTA */}
              <View className="border-t border-border-light dark:border-border-dark pt-4 mt-4">
                <ActionCTA
                  onPress={handleUpdateStock}
                  itemCount={selectedProducts.length}
                  disabled={selectedProducts.length === 0}
                  mode="stock"
                />
              </View>
            </View>
          </>
        )}
      </View>
    </>
  );
}

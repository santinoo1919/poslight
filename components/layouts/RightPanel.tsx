import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Keypad from "../Keypad";
import ActionCTA from "../ActionCTA";
import ItemList from "../ItemList";
import CartItemCard from "../CartItemCard";
import StockItemCard from "../StockItemCard";
import type { Product, CartProduct } from "../../types/components";
import { useCartStore } from "../../stores/cartStore";
import { useCartOperations } from "../../hooks/useCartOperations";
import { useStockOperations } from "../../hooks/useStockOperations";
import { useTheme } from "../../stores/themeStore";

export default function RightPanel() {
  const { isDark } = useTheme();
  // Tab state
  const [activeTab, setActiveTab] = useState<"cart" | "stock">("cart");
  // Keypad collapse state
  const [isKeypadCollapsed, setIsKeypadCollapsed] = useState(true); // Start collapsed

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
      <View
        className={`flex-row ${isDark ? "bg-background-dark" : "bg-background-light"} border-b ${isDark ? "border-border-dark" : "border-border-light"}`}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("cart")}
          className={`flex-1 py-3 px-4 ${
            activeTab === "cart"
              ? `${isDark ? "bg-surface-dark border-b-2 border-state-successDark" : "bg-surface-light border-b-2 border-state-success"}`
              : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "cart"
                ? `${isDark ? "text-text-inverse" : "text-text-primary"}`
                : `${isDark ? "text-text-muted" : "text-text-secondary"}`
            }`}
          >
            🛒 Cart ({selectedProducts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("stock")}
          className={`flex-1 py-3 px-4 ${
            activeTab === "stock"
              ? `${isDark ? "bg-surface-dark border-b-2 border-state-successDark" : "bg-surface-light border-b-2 border-state-success"}`
              : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "stock"
                ? `${isDark ? "text-text-inverse" : "text-text-primary"}`
                : `${isDark ? "text-text-muted" : "text-text-secondary"}`
            }`}
          >
            📦 Stock
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View
        className={`flex-1 p-4 ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
      >
        {activeTab === "cart" ? (
          <>
            {/* Keypad Section */}
            <View className="mb-4">
              {/* Keypad Header with Collapse Toggle */}
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  className={`text-lg font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"}`}
                >
                  Keypad
                </Text>
                <Pressable
                  onPress={() => {
                    console.log(
                      "🔄 Toggling keypad collapse:",
                      !isKeypadCollapsed
                    );
                    setIsKeypadCollapsed(!isKeypadCollapsed);
                  }}
                  className={`p-2 rounded-lg ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
                >
                  <Ionicons
                    name={isKeypadCollapsed ? "chevron-down" : "chevron-up"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              {!isKeypadCollapsed && (
                <>
                  {selectedProductForQuantity && (
                    <View
                      className={`${isDark ? "bg-background-dark" : "bg-background-light"} border ${isDark ? "border-border-dark" : "border-border-light"} rounded-lg p-3 mb-3`}
                    >
                      <Text
                        className={`text-sm font-medium ${isDark ? "text-text-inverse" : "text-text-primary"} text-center`}
                      >
                        {selectedProductForQuantity.name}
                      </Text>
                      <Text
                        className={`text-lg font-bold ${isDark ? "text-text-inverse" : "text-text-primary"} text-center mt-1`}
                      >
                        {keypadInput || "0"}
                      </Text>
                      <Text
                        className={`text-xs ${isDark ? "text-text-muted" : "text-text-secondary"} text-center mt-1`}
                      >
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
                </>
              )}
            </View>

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
            <View
              className={`border-t ${isDark ? "border-border-dark" : "border-border-light"} pt-4 mt-4`}
            >
              <ActionCTA
                onPress={handleCompleteSale}
                totalAmount={getTotalAmount()}
                itemCount={selectedProducts.length}
                disabled={selectedProducts.length === 0}
                mode="cart"
              />
            </View>
          </>
        ) : (
          <>
            {/* Keypad Section for Stock */}
            <View className="mb-4">
              {/* Keypad Header with Collapse Toggle */}
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  className={`text-lg font-semibold ${isDark ? "text-text-inverse" : "text-text-primary"}`}
                >
                  Stock Keypad
                </Text>
                <Pressable
                  onPress={() => setIsKeypadCollapsed(!isKeypadCollapsed)}
                  className={`p-2 rounded-lg ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
                >
                  <Ionicons
                    name={isKeypadCollapsed ? "chevron-down" : "chevron-up"}
                    size={20}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              {!isKeypadCollapsed && (
                <>
                  {selectedProductForQuantity && (
                    <View
                      className={`${isDark ? "bg-background-dark" : "bg-background-light"} border ${isDark ? "border-border-dark" : "border-border-light"} rounded-lg p-3 mb-3`}
                    >
                      <Text
                        className={`text-sm font-medium ${isDark ? "text-text-inverse" : "text-text-primary"} text-center`}
                      >
                        Adding stock to: {selectedProductForQuantity.name}
                      </Text>
                      <Text
                        className={`text-lg font-bold ${isDark ? "text-text-inverse" : "text-text-primary"} text-center mt-1`}
                      >
                        +{keypadInput || "0"}
                      </Text>
                      <Text
                        className={`text-xs ${isDark ? "text-text-muted" : "text-text-secondary"} text-center mt-1`}
                      >
                        Current:{" "}
                        {selectedProductForQuantity.inventory?.stock ?? 0} →
                        New:{" "}
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
                </>
              )}
            </View>

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
            <View
              className={`border-t ${isDark ? "border-border-dark" : "border-border-light"} pt-4 mt-4`}
            >
              <ActionCTA
                onPress={handleUpdateStock}
                itemCount={selectedProducts.length}
                disabled={selectedProducts.length === 0}
                mode="stock"
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}

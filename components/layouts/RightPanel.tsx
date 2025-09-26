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
import { useKeypadOperations } from "../../hooks/useKeypadOperations";
import { useTheme } from "../../stores/themeStore";
import { useDrawerStore } from "../../stores/drawerStore";

export default function RightPanel() {
  const { isDark } = useTheme();
  // Tab state from store
  const { activeTab, setActiveTab } = useDrawerStore();
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
  } = useCartStore();

  // Custom hooks for operations
  const { handleCompleteSale, getTotalAmount } = useCartOperations();
  const { handleUpdateStock } = useStockOperations();
  const {
    handleKeypadNumber,
    handleKeypadDelete,
    handleKeypadClear,
    handleKeypadEnter,
  } = useKeypadOperations();

  return (
    <>
      {/* Tab Header */}
      <View
        className={`flex-row border-b ${isDark ? "border-border-dark" : "border-border-light"}`}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("cart")}
          className={`flex-1 py-3 px-4 ${
            activeTab === "cart"
              ? `border-b-2 ${isDark ? "border-state-successDark" : "border-state-success"}`
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
              ? `border-b-2 ${isDark ? "border-state-successDark" : "border-state-success"}`
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
      <View className="flex-1 flex-col">
        {/* Scrollable Content */}
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
                          className={`text-4xl font-bold ${isDark ? "text-text-inverse" : "text-text-primary"} text-center mt-1`}
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
                      mode={activeTab}
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
                    Keypad
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
                          className={`text-4xl font-bold ${isDark ? "text-text-inverse" : "text-text-primary"} text-center mt-1`}
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
                      mode={activeTab}
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
            </>
          )}
        </View>

        {/* Sticky CTA at Bottom */}
        <View
          className={`border-t ${isDark ? "border-border-dark" : "border-border-light"} p-4 ${isDark ? "bg-surface-dark" : "bg-surface-light"}`}
        >
          {activeTab === "cart" ? (
            <ActionCTA
              onPress={handleCompleteSale}
              totalAmount={getTotalAmount()}
              itemCount={selectedProducts.length}
              disabled={selectedProducts.length === 0}
              mode="cart"
            />
          ) : (
            <ActionCTA
              onPress={handleUpdateStock}
              itemCount={selectedProducts.length}
              disabled={selectedProducts.length === 0}
              mode="stock"
            />
          )}
        </View>
      </View>
    </>
  );
}

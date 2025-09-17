import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Keypad from "../Keypad";
import type { Product, CartProduct } from "../../types/components";
import { useCartStore } from "../../stores/cartStore";
import { ToastService } from "../../services/toastService";
import {
  useSyncSale,
  useSyncSaleItems,
  useSyncInventory,
  useSyncStockUpdate,
} from "../../hooks/useSyncMutations";
import { useAuthStore } from "../../stores/authStore";

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
    completeSale,
    getTotalAmount,
  } = useCartStore();

  // Sync mutations
  const syncSale = useSyncSale();
  const syncSaleItems = useSyncSaleItems();
  const syncInventory = useSyncInventory();
  const syncStockUpdate = useSyncStockUpdate();

  const handleCompleteSale = async () => {
    // Final validation before sale
    for (const product of selectedProducts) {
      const stock = product.inventory?.stock ?? 0;
      if (product.quantity > stock) {
        ToastService.stock.insufficient(product.name, product.quantity, stock);
        return;
      }
    }

    // Store selected products before clearing cart
    const productsToSync = [...selectedProducts];

    // Complete the sale (this updates local state immediately and clears cart)
    completeSale();

    // Prepare sync data for database (only if online)
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) return;

    const totalAmount = productsToSync.reduce(
      (sum, product) =>
        sum + (product.inventory?.sell_price || 0) * product.quantity,
      0
    );

    const saleId = crypto.randomUUID();

    const saleData = {
      id: saleId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: "cash",
      status: "completed",
      created_at: new Date().toISOString(),
    };

    const saleItems = productsToSync.map((product) => ({
      sale_id: saleId,
      inventory_id: product.inventory?.id,
      product_id: product.id,
      quantity: product.quantity,
      unit_price: product.inventory?.sell_price || 0,
      total_price: (product.inventory?.sell_price || 0) * product.quantity,
    }));

    const inventoryUpdates = productsToSync.map((product) => ({
      product_id: product.id,
      user_id: userId,
      stock: (product.inventory?.stock || 0) - product.quantity,
      buy_price: product.inventory?.buy_price || 0,
      sell_price: product.inventory?.sell_price || 0,
      is_active: true,
      updated_at: new Date().toISOString(),
    }));

    // Queue sync mutations (will retry when online)
    console.log("🔄 Starting sync with data:", {
      saleData,
      saleItems,
      inventoryUpdates,
    });

    try {
      await Promise.all([
        syncSale.mutateAsync(saleData),
        syncSaleItems.mutateAsync(saleItems),
        syncInventory.mutateAsync(inventoryUpdates),
      ]);
      console.log("✅ All sync mutations completed successfully");
    } catch (error) {
      console.error("❌ Sync failed:", error);
      // Mutations will retry automatically when online
    }
  };

  const handleUpdateStock = async () => {
    // Final validation before stock update
    for (const product of selectedProducts) {
      if (product.quantity < 0) {
        ToastService.stock.insufficient(product.name, product.quantity, 0);
        return;
      }
    }

    // Store selected products before clearing cart
    const productsToUpdate = [...selectedProducts];

    // Get user ID for sync
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) return;

    // Update stock locally first
    const { db } = require("../../services/tinybaseStore");

    for (const product of productsToUpdate) {
      const oldStock = product.inventory?.stock || 0;
      const stockToAdd = product.quantity;
      const newStock = oldStock + stockToAdd;

      // Update local stock (add to existing)
      db.updateStock(product.id, newStock);

      // Add stock update record for sync
      db.addStockUpdate(product.id, oldStock, newStock);
    }

    // Clear the cart
    selectedProducts.forEach((product) => removeFromCart(product.id));

    // Prepare sync data for database (only if online)
    try {
      const stockUpdates = productsToUpdate.map((product) => {
        const oldStock = product.inventory?.stock || 0;
        const stockToAdd = product.quantity;
        const newStock = oldStock + stockToAdd;

        return {
          product_id: product.id,
          old_stock: oldStock,
          new_stock: newStock,
          created_at: new Date().toISOString(),
        };
      });

      console.log("🔄 Starting stock sync with data:", stockUpdates);

      // Sync each stock update
      await Promise.all(
        stockUpdates.map((update) => syncStockUpdate.mutateAsync(update))
      );

      console.log("✅ All stock updates synced successfully");
    } catch (error) {
      console.error("❌ Stock sync failed:", error);
      // Updates will retry automatically when online
    }
  };

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

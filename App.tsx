import "./global.css";
import { StatusBar } from "expo-status-bar";
import React from "react";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import MainLayout from "./components/layouts/MainLayout";
import LeftPanel from "./components/layouts/LeftPanel";
import RightPanel from "./components/layouts/RightPanel";
import Toast from "react-native-toast-message";
import type { Product } from "./types/database";
import { View, Text } from "react-native";
import { useProductStore } from "./stores/productStore";
import { useCartStore } from "./stores/cartStore";
import useTinyBase from "./hooks/useTinyBase";

function AppContent() {
  // Get data from TinyBase hook
  const {
    searchProducts,
    products,
    categories,
    loading,
    error,
    resetProducts,
    updateProductStock,
  } = useTinyBase();

  // Get product state from Zustand store
  const {
    setProducts,
    setCategories,
    setLoading,
    setError,
    currentCategory,
    searchResults,
    isFiltering,
    visibleProducts,
    handleCategorySelect,
    handleSearch,
    clearSearch,
    getVisibleProducts,
  } = useProductStore();

  // Get cart state from Zustand store
  const {
    selectedProducts,
    selectedProductForQuantity,
    keypadInput,
    dailyRevenue,
    dailyProfit,
    addToCart,
    removeFromCart,
    updateQuantity,
    setSelectedProductForQuantity,
    setKeypadInput,
    getTotalAmount,
    completeSale,
  } = useCartStore();

  // Sync TinyBase data to Zustand store
  React.useEffect(() => {
    console.log("🔄 App: Syncing TinyBase data to Zustand", {
      productsLength: products?.length || 0,
      categoriesLength: categories?.length || 0,
      loading,
      error,
    });

    // Only set products/categories when they actually exist
    if (products) {
      setProducts(products);
    }
    if (categories) {
      setCategories(categories);
    }
    setLoading(loading);
    setError(error);
  }, [
    products,
    categories,
    loading,
    error,
    setProducts,
    setCategories,
    setLoading,
    setError,
  ]);

  // Event handlers
  const handleProductPress = (product: Product) => {
    React.startTransition(() => {
      setSelectedProductForQuantity(product);
      setKeypadInput("");
    });
  };

  const handleKeypadNumber = (num: string) => {
    setKeypadInput((prev: string) => prev + num);
  };

  const handleKeypadDelete = () => {
    setKeypadInput(keypadInput.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setKeypadInput("");
  };

  const handleKeypadEnter = () => {
    if (keypadInput && selectedProductForQuantity) {
      const quantity = parseInt(keypadInput);
      if (quantity > 0) {
        addToCart(selectedProductForQuantity, quantity);
        setSelectedProductForQuantity(null);
        setKeypadInput("");
      }
    }
  };

  // Enhanced completeSale that calls parent callbacks
  const handleCompleteSale = () => {
    completeSale();

    // Update stock in both TinyBase and Zustand stores
    if (updateProductStock) {
      selectedProducts.forEach((product) => {
        const currentStock = product.stock || 0;
        const newStock = Math.max(0, currentStock - product.quantity);

        // Update TinyBase store (for persistence)
        updateProductStock(product.id, newStock);

        // Update Zustand store (for UI updates)
        const { updateProductStock: updateZustandStock } =
          useProductStore.getState();
        updateZustandStock(product.id, newStock);
      });
    }
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Header - Sticky and Reduced Height */}
      <View className="bg-gray-50 pt-4 pb-3 px-4 border-b border-gray-200 sticky top-0 z-10">
        <View className="flex-row items-center justify-between">
          {/* Left side - Empty space to balance layout */}
          <View className="w-40" />

          {/* Centered title and subtitle */}
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-gray-800 text-center">
              POS Light
            </Text>
            <Text className="text-gray-500 mt-1 text-sm text-center">
              Simple • Fast • Offline
            </Text>
          </View>

          {/* Right side - Daily metrics */}
          <View className="flex-shrink-0">
            <View className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg px-3 py-2">
              <View className="flex-row items-center space-x-3">
                <View className="items-center">
                  <Text className="text-xs text-gray-600">Today's Revenue</Text>
                  <Text className="text-sm font-bold text-green-600">
                    €{dailyRevenue.toFixed(2)}
                  </Text>
                </View>
                <View className="w-px h-8 bg-gray-300"></View>
                <View className="items-center">
                  <Text className="text-xs text-gray-600">Today's Profit</Text>
                  <Text className="text-sm font-bold text-blue-600">
                    €{dailyProfit.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <MainLayout
        leftPanel={
          <LeftPanel
            onProductPress={handleProductPress}
            onRefresh={resetProducts}
          />
        }
        rightPanel={
          <RightPanel
            selectedProducts={selectedProducts}
            selectedProductForQuantity={selectedProductForQuantity}
            keypadInput={keypadInput}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onSetSelectedProductForQuantity={setSelectedProductForQuantity}
            onSetKeypadInput={setKeypadInput}
            onKeypadNumber={handleKeypadNumber}
            onKeypadDelete={handleKeypadDelete}
            onKeypadClear={handleKeypadClear}
            onKeypadEnter={handleKeypadEnter}
            onCompleteSale={handleCompleteSale}
            getTotalAmount={getTotalAmount}
          />
        }
      />

      <Toast />
    </SafeAreaWrapper>
  );
}

export default function App() {
  return <AppContent />;
}

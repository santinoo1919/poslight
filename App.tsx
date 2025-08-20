import "./global.css";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import Keypad from "./components/Keypad";
import SuccessScreen from "./components/SuccessScreen";
import useTinyBase from "./hooks/useTinyBase";
import useStock from "./hooks/useStock";
import Toast from "react-native-toast-message";
import type { Product, Category } from "./types/database";

interface CartProduct extends Product {
  quantity: number;
}

interface SaleData {
  totalAmount: number;
  itemCount: number;
  items: CartProduct[];
}

export default function App() {
  const {
    searchProducts,
    products,
    categories,
    loading,
    error,
    resetProducts,
    updateProductStock,
  } = useTinyBase();

  const { canSell, sellProduct, isLowStock, updateStock } = useStock();

  // Simple local state for filtering
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<CartProduct[]>([]);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);

  // Pre-compute results for instant performance
  const allProductsResult = useMemo(() => products, [products]);
  const categoryResults = useMemo(() => {
    const results: Record<string, Product[]> = {};
    if (products.length > 0 && categories) {
      categories.forEach((category) => {
        results[category.name] = products.filter(
          (product) => product.categoryName === category.name
        );
      });
    }
    return results;
  }, [products, categories]);

  // Keypad state
  const [keypadInput, setKeypadInput] = useState<string>("");
  const [selectedProductForQuantity, setSelectedProductForQuantity] =
    useState<Product | null>(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState<boolean>(false);
  const [lastSaleData, setLastSaleData] = useState<SaleData | null>(null);

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleProductPress = (product: Product) => {
    // Set this product for quantity input via keypad
    setSelectedProductForQuantity(product);
    setKeypadInput("");
  };

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === "Show All") {
      // Performance monitoring for "Show All"
      console.log("🚀 Show All clicked - starting...");
      const startTime = Date.now();

      // Use pre-computed result for instant performance
      setFilteredProducts(allProductsResult);
      setCurrentCategory(null);

      const endTime = Date.now();
      console.log(`⚡ Show All completed in: ${endTime - startTime}ms`);
      return;
    }

    // Use pre-computed category results for instant performance
    const categoryProducts = categoryResults[categoryName] || [];
    setFilteredProducts(categoryProducts);
    setCurrentCategory(categoryName);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      if (currentCategory && currentCategory !== "Show All") {
        // Use pre-computed category results
        const categoryProducts = categoryResults[currentCategory] || [];
        setFilteredProducts(categoryProducts);
      } else {
        // Use pre-computed all products result
        setFilteredProducts(allProductsResult);
      }
      return;
    }

    // Use Fuse.js for lightning-fast fuzzy search
    const searchResults = searchProducts(query);
    setFilteredProducts(searchResults);
  };

  const removeFromCart = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const getTotalAmount = (): number => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Complete the sale and update stock
  const completeSale = () => {
    if (selectedProducts.length === 0) {
      Toast.show({
        type: "error",
        text1: "Cart is empty!",
        text2: "Please add products to cart",
        position: "bottom",
        visibilityTime: 3000,
        text1Style: { fontSize: 16, fontWeight: "bold" },
        text2Style: { fontSize: 14, fontWeight: "500" },
      });
      return;
    }

    // Store cart data before clearing
    const cartItems = [...selectedProducts];
    const totalAmount = getTotalAmount();

    // Decrement stock for all items in cart and update UI
    cartItems.forEach((product) => {
      const newStock = sellProduct(product.id, product.quantity);
      // Update UI state for immediate feedback
      if (newStock !== false) {
        updateProductStock(product.id, newStock);
      }
    });

    // Store sale data for success screen
    setLastSaleData({
      totalAmount,
      itemCount: cartItems.length,
      items: cartItems,
    });

    // Clear cart first
    setSelectedProducts([]);

    // Show success toast
    Toast.show({
      type: "success",
      text1: "Sale Complete! 🎉",
      text2: `€${totalAmount.toFixed(2)} added to daily sales`,
      position: "bottom",
      visibilityTime: 4000,
      text1Style: { fontSize: 16, fontWeight: "bold" },
      text2Style: { fontSize: 14, fontWeight: "500" },
    });

    // Show success screen
    setShowSuccessScreen(true);
  };

  // Keypad handlers
  const handleKeypadNumber = (number: string) => {
    if (selectedProductForQuantity) {
      const newInput = keypadInput + number;
      setKeypadInput(newInput);

      // Auto-add to cart when quantity is entered
      const quantity = parseInt(newInput);
      if (quantity > 0) {
        // Check stock before adding to cart
        if (canSell(selectedProductForQuantity.id, quantity)) {
          // Add to cart or update existing
          setSelectedProducts((prev) => {
            const existing = prev.find(
              (p) => p.id === selectedProductForQuantity.id
            );
            if (existing) {
              // Update existing item
              return prev.map((p) =>
                p.id === selectedProductForQuantity.id ? { ...p, quantity } : p
              );
            } else {
              // Add new item
              return [...prev, { ...selectedProductForQuantity, quantity }];
            }
          });

          // Don't decrement stock yet - wait for actual sale

          // Reset keypad state after auto-adding
          setKeypadInput("");
          setSelectedProductForQuantity(null);
        } else {
          // Show stock error toast
          Toast.show({
            type: "error",
            text1: "Stock Error ❌",
            text2: `Not enough stock! Available: ${selectedProductForQuantity.stock}`,
            position: "bottom",
            visibilityTime: 4000,
            text1Style: { fontSize: 16, fontWeight: "bold" },
            text2Style: { fontSize: 14, fontWeight: "500" },
          });
        }
      }
    }
  };

  const handleKeypadClear = () => {
    setKeypadInput("");
    setSelectedProductForQuantity(null);
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Header - Sticky and Reduced Height */}
      <View className="bg-white pt-4 pb-3 px-4 border-b border-gray-200 sticky top-0 z-10">
        <Text className="text-xl font-bold text-gray-800 text-center">
          POS Light
        </Text>
        <Text className="text-gray-500 text-center mt-1 text-sm">
          Simple • Fast • Offline
        </Text>
      </View>

      {/* Main Layout - Left Panel (Products) + Right Panel (POS) */}
      <View className="flex-1 flex-row">
        {/* Left Panel - Products & Search */}
        <View className="flex-1 border-r border-gray-200">
          {/* Categories */}
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </Text>
            <View className="flex-row items-center justify-between">
              {/* Categories on the left */}
              <View className="flex-row flex-wrap items-center flex-1">
                {/* Show All option */}
                <TouchableOpacity
                  className={`mr-2 px-3 py-2 rounded-full border ${
                    currentCategory === null
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-200 bg-white"
                  }`}
                  onPress={() => handleCategorySelect("Show All")}
                >
                  <Text
                    className={`text-xs font-medium ${
                      currentCategory === null
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    📦 Show All
                  </Text>
                </TouchableOpacity>

                {!categories ||
                !Array.isArray(categories) ||
                categories.length === 0 ? (
                  <View className="mr-2 px-3 py-2 rounded-full border border-gray-200 bg-gray-100">
                    <Text className="text-xs text-gray-500">
                      Loading categories...
                    </Text>
                  </View>
                ) : (
                  categories.map((category) => (
                    <TouchableOpacity
                      key={category.name}
                      className={`mr-2 px-3 py-2 rounded-full border ${
                        currentCategory === category.name
                          ? "border-blue-500 bg-blue-100"
                          : "border-gray-200 bg-white"
                      }`}
                      onPress={() => handleCategorySelect(category.name)}
                    >
                      <Text
                        className={`text-xs ${
                          currentCategory === category.name
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {category.icon} {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>

              {/* Search Bar - On the right, using remaining space */}
              <View className="ml-4 flex-shrink-0">
                <SearchBar onSearch={handleSearch} />
              </View>
            </View>
          </View>

          {/* Product Grid */}
          <View className="flex-1">
            <ProductGrid
              onProductPress={handleProductPress}
              products={filteredProducts}
              allProducts={products}
              loading={loading}
              error={error}
              onRefresh={resetProducts}
              selectedProductForQuantity={selectedProductForQuantity}
              isFiltering={isFiltering}
              currentCategory={currentCategory}
            />
          </View>
        </View>

        {/* Right Panel - POS Interface */}
        <View className="w-80 bg-white border-l border-gray-200">
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
                onNumberPress={handleKeypadNumber}
                onDelete={() => setKeypadInput(keypadInput.slice(0, -1))}
                onClear={handleKeypadClear}
                onEnter={() => {
                  if (keypadInput) {
                    handleKeypadNumber(keypadInput);
                  }
                }}
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
                            onPress={() => removeFromCart(product.id)}
                            className="p-1"
                          >
                            <Text className="text-red-500 text-lg">×</Text>
                          </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center justify-between">
                          <Text className="text-gray-600 text-sm">
                            €{product.price.toFixed(2)} × {product.quantity}
                          </Text>
                          <Text className="font-bold text-gray-800">
                            €{(product.price * product.quantity).toFixed(2)}
                          </Text>
                        </View>

                        {/* Stock Status */}
                        <View className="mt-2">
                          <Text
                            className={`text-xs ${
                              (product.stock || 0) <= 10
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          >
                            Stock: {product.stock}{" "}
                            {(product.stock || 0) <= 10 && "⚠️"}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                {/* Total and Checkout - Sticky at Bottom */}
                <View className="border-t border-gray-200 pt-3 bg-white">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-semibold text-gray-800">
                      Total:
                    </Text>
                    <Text className="text-xl font-bold text-green-600">
                      €{getTotalAmount().toFixed(2)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="bg-green-500 rounded-lg py-3 flex-row justify-center items-center"
                    onPress={completeSale}
                  >
                    <Text className="text-white font-bold text-lg">
                      💳 Checkout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Success Screen */}
      {showSuccessScreen && lastSaleData && (
        <SuccessScreen
          message="Sale Complete!"
          onContinue={() => setShowSuccessScreen(false)}
          onClose={() => setShowSuccessScreen(false)}
          totalAmount={lastSaleData.totalAmount}
          itemCount={lastSaleData.itemCount}
        />
      )}

      {/* Toast Notifications */}
      <Toast position="bottom" bottomOffset={20} />
    </SafeAreaWrapper>
  );
}

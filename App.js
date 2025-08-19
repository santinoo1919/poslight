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
import useTinyBase from "./hooks/useTinyBase";

export default function App() {
  const {
    searchProducts,
    products,
    categories,
    loading,
    error,
    resetProducts,
  } = useTinyBase();

  // Simple local state for filtering
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Keypad state
  const [keypadInput, setKeypadInput] = useState("");
  const [selectedProductForQuantity, setSelectedProductForQuantity] =
    useState(null);

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleProductPress = (product) => {
    // Set this product for quantity input via keypad
    setSelectedProductForQuantity(product);
    setKeypadInput("");
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName === "Show All") {
      setFilteredProducts(products);
      setCurrentCategory(null);
      return;
    }

    const categoryProducts = products.filter(
      (product) => product.categoryName === categoryName
    );
    setFilteredProducts(categoryProducts);
    setCurrentCategory(categoryName);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      if (currentCategory && currentCategory !== "Show All") {
        const categoryProducts = products.filter(
          (product) => product.categoryName === currentCategory
        );
        setFilteredProducts(categoryProducts);
      } else {
        setFilteredProducts(products);
      }
      return;
    }

    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchResults);
  };

  const removeFromCart = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
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

  const getTotalAmount = () => {
    return selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  // Keypad handlers
  const handleKeypadNumber = (number) => {
    if (selectedProductForQuantity) {
      const newInput = keypadInput + number;
      setKeypadInput(newInput);

      // Auto-add to cart when quantity is entered
      const quantity = parseInt(newInput);
      if (quantity > 0) {
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

        // Reset keypad state after auto-adding
        setKeypadInput("");
        setSelectedProductForQuantity(null);
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
          Simple • Fast • TinyBase
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
            <View className="flex-row items-center">
              {/* Categories on the left */}
              <View className="flex-row flex-wrap flex-1">
                {/* Show All option */}
                <TouchableOpacity
                  className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
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

                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    className={`mr-2 mb-2 px-3 py-1 rounded-full border ${
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
                ))}
              </View>

              {/* Search Bar - On the right, using remaining space */}
              <View className="ml-4 flex-1 max-w-64">
                <SearchBar onSearch={handleSearch} />
              </View>
            </View>
          </View>

          {/* Product Grid */}
          <View className="flex-1">
            <ProductGrid
              onProductPress={handleProductPress}
              products={filteredProducts}
              loading={loading}
              error={error}
              onRefresh={resetProducts}
              selectedProductForQuantity={selectedProductForQuantity}
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
                </View>
              )}

              <Keypad
                onNumberPress={handleKeypadNumber}
                onClear={handleKeypadClear}
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

                  <TouchableOpacity className="bg-green-500 rounded-lg py-3 items-center">
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
    </SafeAreaWrapper>
  );
}

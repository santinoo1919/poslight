import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, Platform, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ProductGrid from "./components/ProductGrid";
import SafeAreaWrapper from "./components/platform/SafeAreaWrapper";
import DatabaseStatus from "./components/DatabaseStatus";
import PerformanceIndicator from "./components/PerformanceIndicator";
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

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleProductPress = (product) => {
    console.log("Product selected:", product.name);
  };

  const handleCategorySelect = (categoryName) => {
    if (categoryName === "Show All") {
      setFilteredProducts(products);
      setCurrentCategory(null);
      return;
    }

    // Simple filtering by category name
    const categoryProducts = products.filter(
      (product) => product.categoryName === categoryName
    );
    setFilteredProducts(categoryProducts);
    setCurrentCategory(categoryName);
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchResults);
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800 text-center">
          POS Light
        </Text>
        <Text className="text-gray-500 text-center mt-1">
          Simple • Fast • TinyBase
        </Text>
      </View>

      {/* Main Layout - Left Panel (Products) + Right Panel (POS) */}
      <View className="flex-1 flex-row">
        {/* Left Panel - Products & Search */}
        <View className="flex-1 border-r border-gray-200">
          {/* Search Bar */}
          <View className="p-4 border-b border-gray-200">
            <SearchBar onSearch={handleSearch} />
          </View>

          {/* Categories */}
          <View className="px-4 py-3 border-b border-gray-200">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </Text>
            <View className="flex-row flex-wrap">
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
                    currentCategory === null ? "text-blue-600" : "text-gray-600"
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
          </View>

          {/* Product Grid */}
          <View className="flex-1">
            <ProductGrid
              onProductPress={handleProductPress}
              products={filteredProducts}
              loading={loading}
              error={error}
              onRefresh={resetProducts}
            />
          </View>
        </View>

        {/* Right Panel - POS Interface */}
        <View className="w-80 bg-white border-l border-gray-200">
          {/* Database Status */}
          <View className="p-4 border-b border-gray-200">
            <DatabaseStatus
              productCount={products.length}
              categoryCount={categories.length}
            />
          </View>

          {/* Performance Indicator */}
          <View className="p-4 border-b border-gray-200">
            <PerformanceIndicator />
          </View>

          {/* POS Interface Placeholder */}
          <View className="flex-1 p-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              POS Interface
            </Text>
            <View className="bg-gray-50 rounded-lg p-4">
              <Text className="text-gray-600 text-center">
                Product selection and keypad will go here
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

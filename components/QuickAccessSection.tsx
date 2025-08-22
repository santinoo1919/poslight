import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import type {
  QuickAccessSectionProps,
  QuickAccessView,
} from "../types/components";

const { width } = Dimensions.get("window");

const QUICK_ACCESS_VIEWS: QuickAccessView[] = [
  {
    id: "most-bought",
    title: "🚀 Most Bought - Quick Access",
    icon: "🚀",
    color: "#1E40AF",
    backgroundColor: "#EFF6FF", // Lighter blue (one tone up)
  },
  {
    id: "low-stock",
    title: "⚠️ Low in Stock",
    icon: "⚠️",
    color: "#DC2626",
    backgroundColor: "#FEF2F2", // Lighter red (one tone up)
  },
  {
    id: "coming-in",
    title: "📦 Coming In (Orders)",
    icon: "📦",
    color: "#059669",
    backgroundColor: "#ECFDF5", // Lighter green (one tone up)
  },
  {
    id: "trending",
    title: "📈 Trending in Area",
    icon: "📈",
    color: "#7C3AED",
    backgroundColor: "#F5F3FF", // Lighter purple (one tone up)
  },
];

const QuickAccessSection = React.memo(
  ({
    products,
    onProductPress,
    selectedProductForQuantity,
  }: QuickAccessSectionProps) => {
    const [currentViewIndex, setCurrentViewIndex] = useState(0);
    const currentView = QUICK_ACCESS_VIEWS[currentViewIndex];

    // Calculate products for each view - ALWAYS uses all products (independent of category selection)
    const viewProducts = useMemo(() => {
      switch (currentView.id) {
        case "most-bought":
          // Products with good stock (150+ units)
          return products.filter((product) => product.stock > 150).slice(0, 8);

        case "low-stock":
          // Products with low stock (≤10 units)
          return products.filter((product) => product.stock <= 10).slice(0, 8);

        case "coming-in":
          // Simulate products coming in (for now, products with medium stock)
          return products
            .filter((product) => product.stock > 10 && product.stock <= 50)
            .slice(0, 8);

        case "trending":
          // Products with good stock that are popular (for now, random selection)
          return products
            .filter((product) => product.stock > 100)
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);

        default:
          return [];
      }
    }, [currentView.id, products]);

    const navigateView = (direction: "prev" | "next") => {
      if (direction === "prev") {
        setCurrentViewIndex((prev) =>
          prev === 0 ? QUICK_ACCESS_VIEWS.length - 1 : prev - 1
        );
      } else {
        setCurrentViewIndex((prev) =>
          prev === QUICK_ACCESS_VIEWS.length - 1 ? 0 : prev + 1
        );
      }
    };

    return (
      <View>
        {/* Header with Title and Navigation */}
        <View className="flex-row items-center justify-between mb-3">
          {/* Title - Normal Color */}
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-700">
              {currentView.title}
            </Text>
          </View>

          {/* Navigation Arrows - Right Side */}
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity
              onPress={() => navigateView("prev")}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-lg">‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateView("next")}
              className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
            >
              <Text className="text-lg">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Products Grid with Background - Fixed Height */}
        <View
          className="rounded-lg p-3"
          style={{
            backgroundColor: currentView.backgroundColor,
            minHeight: 200, // Ensure consistent height
          }}
        >
          {/* Horizontal Scrollable Products */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {viewProducts.map((item) => (
              <View key={item.id} className="w-1/4 p-1 flex-shrink-0">
                <TouchableOpacity
                  className={`rounded-lg border p-3 h-full ${
                    selectedProductForQuantity?.id === item.id
                      ? "bg-blue-50 border-blue-300 shadow-sm"
                      : "bg-white border-gray-200"
                  }`}
                  onPress={() => onProductPress(item)}
                  activeOpacity={0.7}
                >
                  {/* Category Badge */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: item.color || "#3B82F6" }}
                    >
                      <Text className="text-white text-xs font-medium">
                        {item.icon || "📦"}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-400">#{item.id}</Text>
                  </View>

                  {/* Product Image Placeholder */}
                  <View className="h-12 bg-gray-100 rounded-md mb-2 items-center justify-center">
                    <Text className="text-gray-500 text-lg">📦</Text>
                  </View>

                  {/* Product Name */}
                  <Text
                    className="font-semibold text-gray-800 text-xs mb-1"
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  {/* Price */}
                  <Text className="text-green-600 font-bold text-sm mb-1">
                    €{item.price.toFixed(2)}
                  </Text>

                  {/* Stock */}
                  <Text
                    className={`text-xs font-medium ${
                      item.stock <= 10 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    Stock: {item.stock}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Empty State - Maintains height */}
          {viewProducts.length === 0 && (
            <View className="h-32 items-center justify-center">
              <Text className="text-gray-500 text-sm">
                No products in this category
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);

export default QuickAccessSection;

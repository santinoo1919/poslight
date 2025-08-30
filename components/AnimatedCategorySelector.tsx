import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

interface Category {
  key: string;
  name: string;
  icon: string;
}

interface AnimatedCategorySelectorProps {
  categories: Category[];
  currentCategory: string | null;
  onCategorySelect: (categoryKey: string | null) => void;
}

export default function AnimatedCategorySelector({
  categories,
  currentCategory,
  onCategorySelect,
}: AnimatedCategorySelectorProps) {
  // Animation values
  const backgroundPosition = useSharedValue(0);
  const backgroundWidth = useSharedValue(0);
  const isTouching = useSharedValue(false);
  const categoryLayouts = React.useRef<{
    [key: string]: { x: number; width: number };
  }>({});

  // Update animation when category changes
  React.useEffect(() => {
    const targetKey = currentCategory === null ? "all" : currentCategory;
    const layout = categoryLayouts.current[targetKey];

    if (layout && !isTouching.value) {
      // Background follows with delay - text changes immediately
      backgroundPosition.value = withDelay(
        25, // Longer delay so text changes first, then background follows
        withTiming(layout.x, {
          duration: 200, // Slightly longer for more natural feel
          easing: Easing.bezier(0.01, -0.15, 0.4, 1.05), // Fast start, strong deceleration
        })
      );

      backgroundWidth.value = withDelay(
        25, // Longer delay so text changes first, then background follows
        withTiming(layout.width, {
          duration: 200, // Slightly longer for more natural feel
          easing: Easing.bezier(0.01, -0.15, 0.4, 1.05), // Fast start, strong deceleration
        })
      );
    }
  }, [currentCategory, categories]);

  // Animated background style
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: backgroundPosition.value }],
    width: backgroundWidth.value,
  }));

  // Handle category selection
  const handleCategoryPress = (categoryKey: string | null) => {
    onCategorySelect(categoryKey);
  };

  // Touch state handlers
  const handlePressIn = () => {
    isTouching.value = true;
  };

  const handlePressOut = () => {
    isTouching.value = false;
  };

  // Measure category positions on layout
  const onCategoryLayout = (key: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    categoryLayouts.current[key] = { x, width };

    // Set initial position for first render
    if (Object.keys(categoryLayouts.current).length === 1) {
      backgroundPosition.value = x;
      backgroundWidth.value = width;
    }
  };

  return (
    <View className="flex-row flex-wrap items-center flex-1 relative">
      {/* Single animated background that moves between categories */}
      <Animated.View
        className="absolute h-8 bg-blue-100 border border-blue-200 rounded-full"
        style={animatedBackgroundStyle}
        pointerEvents="none"
      />

      {/* Show All option - using Pressable for better touch handling */}
      <Pressable
        className="mr-2 px-3 py-2 rounded-full"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleCategoryPress(null)}
        onLayout={(event) => onCategoryLayout("all", event)}
        android_ripple={null}
        android_disableSound={true}
      >
        <Text
          className={`text-xs font-medium ${
            currentCategory === null ? "text-blue-600" : "text-slate-500"
          }`}
        >
          📦 Show All
        </Text>
      </Pressable>

      {/* Categories - using Pressable for better touch handling */}
      {categories.map((category) => (
        <Pressable
          key={category.name}
          className="mr-2 px-3 py-2 rounded-full"
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => handleCategoryPress(category.key)}
          onLayout={(event) => onCategoryLayout(category.key, event)}
          android_ripple={null}
          android_disableSound={true}
        >
          <Text
            className={`text-xs ${
              currentCategory === category.key
                ? "text-blue-600 font-medium"
                : "text-slate-500"
            }`}
          >
            {category.icon} {category.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

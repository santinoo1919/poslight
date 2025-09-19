import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useTheme } from "../stores/themeStore";

interface EmptyState {
  title: string;
  subtitle: string;
}

interface ItemListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyState: EmptyState;
  key?: string;
  className?: string;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
}

export default function ItemList<T>({
  items,
  renderItem,
  emptyState,
  key,
  className = "flex-1",
  contentContainerStyle = { paddingBottom: 20 },
  showsVerticalScrollIndicator = false,
}: ItemListProps<T>) {
  const { isDark } = useTheme();

  if (items.length === 0) {
    return (
      <View
        className={`${isDark ? "bg-background-dark" : "bg-background-light"} rounded-lg p-4`}
      >
        <Text
          className={`${isDark ? "text-text-muted" : "text-text-secondary"} text-center`}
        >
          {emptyState.title}
        </Text>
        <Text
          className={`${isDark ? "text-text-secondary" : "text-text-muted"} text-xs text-center mt-2`}
        >
          {emptyState.subtitle}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={className}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={contentContainerStyle}
      scrollEventThrottle={16}
      bounces={true}
      alwaysBounceVertical={false}
      keyboardShouldPersistTaps="handled"
    >
      <View className="space-y-4">
        {items.map((item, index) => (
          <View key={key ? `${key}-${index}` : index} className="mb-1">
            {renderItem(item, index)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

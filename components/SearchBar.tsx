import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  Pressable,
} from "react-native";
import type { SearchBarProps } from "../types/components";
import { useTheme } from "../stores/themeStore";

const SearchBar = React.memo(
  ({
    onSearch,
    placeholder = "Search products...",
    value,
    onChangeText,
  }: SearchBarProps) => {
    const { isDark } = useTheme();
    const [searchText, setSearchText] = useState(value || "");

    const handleSearch = (text: string) => {
      setSearchText(text);
      onSearch(text);
      onChangeText?.(text);
    };

    const clearSearch = () => {
      setSearchText("");
      onSearch("");
      onChangeText?.("");
      Keyboard.dismiss(); // Dismiss keyboard when clearing
    };

    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };

    // Use controlled value if provided, otherwise use local state
    const displayValue = value !== undefined ? value : searchText;

    return (
      <View
        className={`${isDark ? "bg-surface-dark border-border-dark" : "bg-surface-light border-border-light"} border rounded-lg px-3 py-2 w-64 h-12`}
      >
        <View className="flex-row items-center justify-center h-full">
          <Text
            className={`${isDark ? "text-text-muted" : "text-text-secondary"} mr-2`}
          >
            🔍
          </Text>
          <TextInput
            className={`flex-1 ${isDark ? "text-text-inverse" : "text-text-primary"} text-base focus:outline-none`}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={displayValue}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={dismissKeyboard} // Dismiss keyboard on search
            style={{
              fontSize: 16,
              textAlignVertical: "center",
              includeFontPadding: false,
            }}
          />
          {/* Always render clear button to prevent layout shifts */}
          <View className="ml-2 w-6 h-6 justify-center items-center">
            {displayValue.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Text
                  className={`${isDark ? "text-text-muted" : "text-text-secondary"} text-xl`}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export default SearchBar;

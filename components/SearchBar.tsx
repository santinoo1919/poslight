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

const SearchBar = React.memo(
  ({
    onSearch,
    placeholder = "Search products...",
    value,
    onChangeText,
  }: SearchBarProps) => {
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
      <View className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 w-64">
        <View className="flex-row items-center">
          <Text className="text-text-secondary dark:text-text-muted mr-2">
            🔍
          </Text>
          <TextInput
            className="flex-1 text-text-primary dark:text-text-inverse text-sm focus:outline-none"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={displayValue}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            onSubmitEditing={dismissKeyboard} // Dismiss keyboard on search
          />
          {/* Always render clear button to prevent layout shifts */}
          <View className="ml-2 w-6 h-6 justify-center items-center">
            {displayValue.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Text className="text-text-secondary dark:text-text-muted text-lg">
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

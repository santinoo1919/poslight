import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import type { SearchBarProps } from "../types/components";

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
  value,
  onChangeText,
}: SearchBarProps) {
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
  };

  // Use controlled value if provided, otherwise use local state
  const displayValue = value !== undefined ? value : searchText;

  return (
    <View className="bg-gray-100 rounded-lg px-3 py-2 w-full">
      <View className="flex-row items-center">
        <Text className="text-gray-500 mr-2">🔍</Text>
        <TextInput
          className="flex-1 text-gray-800 text-sm focus:outline-none"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={displayValue}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Always render clear button to prevent layout shifts */}
        <View className="ml-2 w-6 h-6 justify-center items-center">
          {displayValue.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

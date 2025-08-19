import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { useState } from "react";

export default function SearchBar({
  onSearch,
  placeholder = "Search products...",
}) {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const clearSearch = () => {
    setSearchText("");
    onSearch("");
  };

  return (
    <View className="px-4 py-3 bg-white border-b border-gray-200">
      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
        <Text className="text-gray-500 mr-2">🔍</Text>
        <TextInput
          className="flex-1 text-gray-800 text-base"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={searchText}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} className="ml-2">
            <Text className="text-gray-500 text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

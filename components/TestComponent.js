import { View, Text, TouchableOpacity } from 'react-native';

export default function TestComponent() {
  return (
    <View className="p-4 bg-gray-100 rounded-lg m-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        NativeWind Test
      </Text>
      <Text className="text-gray-600 mb-4">
        If you can see this styled text, NativeWind is working!
      </Text>
      <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-md">
        <Text className="text-white font-medium text-center">
          Test Button
        </Text>
      </TouchableOpacity>
    </View>
  );
}

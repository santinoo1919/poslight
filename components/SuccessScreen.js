import { View, Text, TouchableOpacity } from "react-native";

export default function SuccessScreen({ onClose, totalAmount, itemCount }) {
  return (
    <View className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <View className="bg-white rounded-2xl p-8 mx-6 max-w-sm w-full">
        {/* Success Icon */}
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">✅</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 text-center">
            Sale Complete!
          </Text>
        </View>

        {/* Sale Details */}
        <View className="mb-6">
          <Text className="text-gray-600 text-center mb-2">
            {itemCount} item{itemCount !== 1 ? "s" : ""} sold
          </Text>
          <Text className="text-3xl font-bold text-green-600 text-center">
            €{totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Stock Updated Message */}
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 text-sm text-center">
            📦 Stock levels have been updated automatically
          </Text>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-green-600 py-4 px-6 rounded-lg"
        >
          <Text className="text-white text-lg font-bold text-center">
            Continue Selling
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

import React from "react";
import { View, Text } from "react-native";

export default function ProductGridSkeleton() {
  // Simple skeleton item component
  const SkeletonItem = ({ width, height, marginBottom = 8 }) => (
    <View
      className="bg-gray-200 rounded-lg"
      style={{
        width,
        height,
        marginBottom,
        opacity: 0.7,
      }}
    />
  );

  return (
    <View className="flex-1">
      {/* Products Header with Count Skeleton */}
      <View className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <View className="flex-row justify-between items-center">
          <SkeletonItem width={120} height={24} />
          <SkeletonItem width={60} height={16} />
        </View>
      </View>

      {/* Product Grid Skeleton */}
      <View className="flex-1">
        <View className="p-4">
          <View className="space-y-6">
            {/* Most Bought Section Skeleton */}
            <View>
              <SkeletonItem width={200} height={20} marginBottom={12} />

              <View className="flex-row flex-wrap justify-start">
                {/* 4 skeleton items for Most Bought */}
                <View className="w-1/4 p-1">
                  <SkeletonItem width="100%" height={140} />
                </View>
                <View className="w-1/4 p-1">
                  <SkeletonItem width="100%" height={140} />
                </View>
                <View className="w-1/4 p-1">
                  <SkeletonItem width="100%" height={140} />
                </View>
                <View className="w-1/4 p-1">
                  <SkeletonItem width="100%" height={140} />
                </View>
              </View>
            </View>

            {/* All Products Grid Skeleton */}
            <View>
              <SkeletonItem width={150} height={20} marginBottom={12} />

              <View className="flex-row flex-wrap justify-start">
                {/* 20 skeleton items for All Products (5 rows x 4 columns) */}
                {Array.from({ length: 20 }).map((_, index) => (
                  <View key={index} className="w-1/4 p-1">
                    <SkeletonItem width="100%" height={140} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

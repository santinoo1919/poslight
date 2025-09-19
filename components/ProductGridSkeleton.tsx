import React from "react";
import { View } from "react-native";
import type {
  ProductGridSkeletonProps,
  SkeletonItemProps,
} from "../types/components";
import { useTheme } from "../stores/themeStore";

export default function ProductGridSkeleton({
  count = 20,
  columns = 4,
}: ProductGridSkeletonProps = {}) {
  const { isDark } = useTheme();

  // Simple skeleton item component
  const SkeletonItem: React.FC<SkeletonItemProps> = ({
    width,
    height,
    marginBottom = 8,
  }) => (
    <View
      className={`${isDark ? "bg-border-dark" : "bg-border-light"} rounded-lg`}
      style={{
        width: width as any,
        height,
        marginBottom,
        opacity: 0.7,
      }}
    />
  );

  return (
    <View className="flex-1">
      {/* Products Header with Count Skeleton */}
      <View
        className={`px-4 py-3 border-b ${isDark ? "border-border-dark bg-background-dark" : "border-border-light bg-background-light"}`}
      >
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
                {/* Dynamic skeleton items based on props */}
                {Array.from({ length: count }).map((_, index) => (
                  <View key={index} className={`w-1/${columns} p-1`}>
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

import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../stores/themeStore";
import type { StepIndicatorProps } from "./types";

export default function StepIndicator({
  currentStep,
  totalSteps,
  steps,
}: StepIndicatorProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex-row justify-center mb-6">
      {steps.map((step) => (
        <View key={step.id} className="flex-row items-center">
          <View
            className={`w-8 h-8 rounded-full items-center justify-center ${
              currentStep >= step.id
                ? isDark
                  ? "bg-brand-primaryDark"
                  : "bg-brand-primary"
                : isDark
                  ? "bg-surface-dark"
                  : "bg-surface-light"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                currentStep >= step.id
                  ? "text-white"
                  : isDark
                    ? "text-text-muted"
                    : "text-text-secondary"
              }`}
            >
              {step.id}
            </Text>
          </View>
          {step.id < totalSteps && (
            <View
              className={`w-8 h-0.5 ${
                currentStep > step.id
                  ? isDark
                    ? "bg-brand-primaryDark"
                    : "bg-brand-primary"
                  : isDark
                    ? "bg-surface-dark"
                    : "bg-surface-light"
              }`}
            />
          )}
        </View>
      ))}
    </View>
  );
}

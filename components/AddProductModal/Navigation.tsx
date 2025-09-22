import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../stores/themeStore";
import type { NavigationProps } from "./types";

export default function Navigation({
  currentStep,
  totalSteps,
  canProceed,
  onPrevious,
  onNext,
  onSubmit,
}: NavigationProps) {
  const { isDark } = useTheme();

  const isLastStep = currentStep === totalSteps;

  return (
    <View
      className={`flex-row justify-between p-4 border-t ${
        isDark ? "border-surface-dark" : "border-surface-light"
      }`}
    >
      <TouchableOpacity
        onPress={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-3 rounded-lg ${
          currentStep === 1
            ? isDark
              ? "bg-surface-dark"
              : "bg-surface-light"
            : isDark
              ? "bg-surface-dark border border-surface-dark"
              : "bg-surface-light border border-surface-light"
        }`}
      >
        <Text
          className={`font-semibold ${
            currentStep === 1
              ? isDark
                ? "text-text-muted"
                : "text-text-secondary"
              : isDark
                ? "text-text-inverse"
                : "text-text-primary"
          }`}
        >
          Previous
        </Text>
      </TouchableOpacity>

      {isLastStep ? (
        <TouchableOpacity
          onPress={onSubmit}
          className={`px-6 py-3 rounded-lg ${
            isDark ? "bg-brand-primaryDark" : "bg-brand-primary"
          }`}
        >
          <Text className="text-white font-semibold">Add Product</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-lg ${
            canProceed
              ? isDark
                ? "bg-brand-primaryDark"
                : "bg-brand-primary"
              : isDark
                ? "bg-surface-dark"
                : "bg-surface-light"
          }`}
        >
          <Text
            className={`font-semibold ${
              canProceed
                ? "text-white"
                : isDark
                  ? "text-text-muted"
                  : "text-text-secondary"
            }`}
          >
            Next
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

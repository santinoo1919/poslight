import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../stores/themeStore";
import type { Step } from "./types";

interface StepTitleProps {
  step: Step;
}

export default function StepTitle({ step }: StepTitleProps) {
  const { isDark } = useTheme();

  return (
    <View className="mb-6">
      <Text
        className={`text-2xl font-bold mb-2 ${
          isDark ? "text-text-inverse" : "text-text-primary"
        }`}
      >
        {step.title}
      </Text>
      <Text
        className={`text-base ${
          isDark ? "text-text-muted" : "text-text-secondary"
        }`}
      >
        {step.description}
      </Text>
    </View>
  );
}

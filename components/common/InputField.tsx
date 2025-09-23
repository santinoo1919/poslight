import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { useTheme } from "../../stores/themeStore";

interface InputFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  showDollarSign?: boolean;
  isReadOnly?: boolean;
  readOnlyValue?: string | number;
}

export default function InputField({
  label,
  required = false,
  error,
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  showDollarSign = false,
  isReadOnly = false,
  readOnlyValue,
  ...textInputProps
}: InputFieldProps) {
  const { isDark } = useTheme();

  const baseInputClasses = `p-4 rounded-lg border text-lg ${
    isDark
      ? "bg-surface-dark border-surface-dark text-text-inverse"
      : "bg-surface-light border-surface-light text-text-primary"
  }`;

  const readOnlyClasses = `p-4 rounded-lg border ${
    isDark
      ? "bg-surface-dark border-border-dark"
      : "bg-surface-light border-border-light"
  }`;

  const labelClasses = `text-md font-medium mb-2 ${
    isDark ? "text-text-inverse" : "text-text-primary"
  } ${labelClassName}`;

  const errorClasses = `text-xs mt-1 ${
    isDark ? "text-red-400" : "text-red-600"
  }`;

  const dollarSignClasses = `absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
    isDark ? "text-text-inverse" : "text-text-primary"
  }`;

  const readOnlyDollarSignClasses = `absolute left-4 top-1/2 transform -translate-y-1/2 text-lg ${
    isDark ? "text-text-muted" : "text-text-secondary"
  }`;

  const readOnlyTextClasses = `text-lg font-semibold ${
    isDark ? "text-text-muted" : "text-text-secondary"
  }`;

  return (
    <View className={`${containerClassName}`}>
      <Text className={labelClasses}>
        {label}
        {required && " *"}
      </Text>

      <View className="relative">
        {isReadOnly ? (
          <View
            className={readOnlyClasses}
            style={{ paddingLeft: showDollarSign ? 40 : 16 }}
          >
            <Text className={readOnlyTextClasses}>{readOnlyValue}</Text>
          </View>
        ) : (
          <TextInput
            className={`${baseInputClasses} ${inputClassName}`}
            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
            style={{
              paddingLeft: showDollarSign ? 40 : 16,
              textAlignVertical: "center",
            }}
            {...textInputProps}
          />
        )}

        {showDollarSign && (
          <Text
            className={
              isReadOnly ? readOnlyDollarSignClasses : dollarSignClasses
            }
            style={{ pointerEvents: "none" }}
          >
            $
          </Text>
        )}
      </View>

      {error && <Text className={errorClasses}>{error}</Text>}
    </View>
  );
}

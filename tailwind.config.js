/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Centralized theme colors
        surface: {
          light: "#ffffff",
          dark: "#1f2937",
        },
        background: {
          light: "#f9fafb", // gray-50
          dark: "#111827", // gray-900
        },
        text: {
          primary: "#1f2937", // gray-800
          secondary: "#6b7280", // gray-500
          muted: "#9ca3af", // gray-400
          inverse: "#f9fafb", // gray-50 (for dark mode)
        },
        border: {
          light: "#e5e7eb", // gray-200
          dark: "#374151", // gray-700
          muted: "#d1d5db", // gray-300
        },
        brand: {
          primary: "#3b82f6", // blue-500
          primaryDark: "#2563eb", // blue-600
        },
        state: {
          success: "#059669", // green-600
          successDark: "#10b981", // emerald-500
          warning: "#d97706", // amber-600
          warningDark: "#f59e0b", // amber-500
          error: "#dc2626", // red-600
          errorDark: "#ef4444", // red-500
        },
        interactive: {
          selected: "#dbeafe", // blue-50
          selectedDark: "#1e3a8a", // blue-900
          disabled: "#f3f4f6", // gray-100
          disabledDark: "#1f2937", // gray-800
        },
      },
    },
  },
  plugins: [],
};

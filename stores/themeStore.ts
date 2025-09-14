import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  // Theme state
  mode: ThemeMode;
  isDark: boolean;

  // Theme actions
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  loadTheme: () => Promise<void>;
}

// Colors are now centralized in tailwind.config.js
// This store only handles theme state (light/dark mode)

export const useThemeStore = create<ThemeState>((set, get) => ({
  // Initial state
  mode: "system",
  isDark: false,

  // Theme actions
  setMode: (mode: ThemeMode) => {
    const isDark = mode === "dark" || (mode === "system" && getSystemTheme());

    console.log("🎨 Theme changing:", { mode, isDark });

    set({
      mode,
      isDark,
    });

    // Save to AsyncStorage (async but don't await)
    AsyncStorage.setItem("theme-mode", mode).catch((error) => {
      console.warn("Failed to save theme mode:", error);
    });
  },

  toggleTheme: () => {
    const { mode } = get();
    const newMode = mode === "light" ? "dark" : "light";
    get().setMode(newMode);
  },

  loadTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem("theme-mode");
      if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
        get().setMode(savedMode as ThemeMode);
      }
    } catch (error) {
      console.warn("Failed to load theme mode:", error);
    }
  },
}));

// Helper function to detect system theme
const getSystemTheme = (): boolean => {
  // In React Native, you can use Appearance API
  // For now, default to light theme
  return false;
};

// Helper hook for easy theme access
export const useTheme = () => {
  const { isDark, setMode, toggleTheme, loadTheme } = useThemeStore();

  return {
    isDark,
    setMode,
    toggleTheme,
    loadTheme,
    // Convenience methods
    isLight: !isDark,
  };
};

import { create } from "zustand";
import { usePersistence } from "../utils/persistence";

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

export const useThemeStore = create<ThemeState>((set, get) => {
  const persistence = usePersistence("theme-store");

  return {
    // Initial state
    mode: "system",
    isDark: false,

    // Theme actions
    setMode: (mode: ThemeMode) => {
      const isDark = mode === "dark" || (mode === "system" && getSystemTheme());

      const newState = { mode, isDark };
      set(newState);
      persistence.save(newState);
    },

    toggleTheme: () => {
      const { mode } = get();
      const newMode = mode === "light" ? "dark" : "light";
      get().setMode(newMode);
    },

    loadTheme: async () => {
      const persisted = await persistence.load();
      if (persisted) {
        set(persisted);
      }
    },
  };
});

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

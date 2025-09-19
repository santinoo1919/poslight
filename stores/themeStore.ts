import { create } from "zustand";
import { usePersistence } from "../utils/persistence";
import { Appearance } from "react-native";

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

  // Listen for system theme changes
  const subscription = Appearance.addChangeListener(({ colorScheme }) => {
    const { mode } = get();
    if (mode === "system") {
      const isDark = colorScheme === "dark";
      set({ isDark });
      persistence.save({ mode, isDark });
    }
  });

  return {
    // Initial state
    mode: "system",
    isDark: false,

    // Theme actions
    setMode: (mode: ThemeMode) => {
      const isDark = mode === "dark" || (mode === "system" && getSystemTheme());
      console.log("🎨 Setting theme mode:", {
        mode,
        isDark,
        systemTheme: getSystemTheme(),
      });

      const newState = { mode, isDark };
      set(newState);
      persistence.save(newState);
    },

    toggleTheme: () => {
      const { mode, isDark } = get();
      const newMode = mode === "light" ? "dark" : "light";
      console.log("🎨 Theme toggle:", {
        currentMode: mode,
        currentIsDark: isDark,
        newMode,
      });
      get().setMode(newMode);
    },

    loadTheme: async () => {
      const persisted = await persistence.load();
      if (persisted) {
        set(persisted);
      } else {
        // If no persisted theme, initialize with system theme
        const isDark = getSystemTheme();
        set({ mode: "system", isDark });
      }
    },
  };
});

// Helper function to detect system theme
const getSystemTheme = (): boolean => {
  try {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === "dark";
  } catch (error) {
    console.log("Error detecting system theme:", error);
    return false; // Fallback to light theme
  }
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

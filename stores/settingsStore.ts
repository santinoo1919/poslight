import { create } from "zustand";
import { usePersistence } from "../utils/persistence";

interface SettingsState {
  // Actions
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const persistence = usePersistence("settings-store");

  return {
    // Actions
    loadSettings: async () => {
      try {
        const savedSettings = await persistence.load();
        if (savedSettings) {
          // Load any future settings here
        }
      } catch (error) {
        console.warn("Failed to load settings:", error);
      }
    },
  };
});

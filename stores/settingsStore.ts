import { create } from "zustand";
import { usePersistence } from "../utils/persistence";

interface SettingsState {
  // Logs settings
  enableLogs: boolean;
  enableBackupLogs: boolean;

  // Actions
  toggleLogs: () => void;
  toggleBackupLogs: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const persistence = usePersistence("settings-store");

  return {
    // Initial state
    enableLogs: true,
    enableBackupLogs: true,

    // Actions
    toggleLogs: () => {
      const newValue = !get().enableLogs;
      set({ enableLogs: newValue });
      persistence.save({ enableLogs: newValue });
    },

    toggleBackupLogs: () => {
      const newValue = !get().enableBackupLogs;
      set({ enableBackupLogs: newValue });
      persistence.save({ enableBackupLogs: newValue });
    },

    loadSettings: async () => {
      try {
        const savedSettings = await persistence.load();
        if (savedSettings) {
          set({
            enableLogs: savedSettings.enableLogs ?? true,
            enableBackupLogs: savedSettings.enableBackupLogs ?? true,
          });
        }
      } catch (error) {
        console.warn("Failed to load settings:", error);
      }
    },
  };
});

// stores/drawerStore.ts
import { create } from "zustand";

interface DrawerState {
  isSalesDrawerOpen: boolean;
  openSalesDrawer: () => void;
  closeSalesDrawer: () => void;
  isSettingsDrawerOpen: boolean;
  openSettingsDrawer: () => void;
  closeSettingsDrawer: () => void;
  activeTab: "cart" | "stock";
  setActiveTab: (tab: "cart" | "stock") => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isSalesDrawerOpen: false,
  openSalesDrawer: () => set({ isSalesDrawerOpen: true }),
  closeSalesDrawer: () => set({ isSalesDrawerOpen: false }),
  isSettingsDrawerOpen: false,
  openSettingsDrawer: () => set({ isSettingsDrawerOpen: true }),
  closeSettingsDrawer: () => set({ isSettingsDrawerOpen: false }),
  activeTab: "cart",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

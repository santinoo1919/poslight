// stores/drawerStore.ts
import { create } from "zustand";

interface DrawerState {
  isSalesDrawerOpen: boolean;
  openSalesDrawer: () => void;
  closeSalesDrawer: () => void;
  activeTab: "cart" | "stock";
  setActiveTab: (tab: "cart" | "stock") => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isSalesDrawerOpen: false,
  openSalesDrawer: () => set({ isSalesDrawerOpen: true }),
  closeSalesDrawer: () => set({ isSalesDrawerOpen: false }),
  activeTab: "cart",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

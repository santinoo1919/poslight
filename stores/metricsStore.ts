import { create } from "zustand";

interface MetricsState {
  dailyRevenue: number;
  dailyProfit: number;

  // Actions
  recordSale: (revenue: number, profit: number) => void;
  resetDaily: () => void;
  getDailyRevenue: () => number;
  getDailyProfit: () => number;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  dailyRevenue: 0,
  dailyProfit: 0,

  recordSale: (revenue: number, profit: number) => {
    set((state) => ({
      dailyRevenue: state.dailyRevenue + revenue,
      dailyProfit: state.dailyProfit + profit,
    }));
  },

  resetDaily: () => {
    set({ dailyRevenue: 0, dailyProfit: 0 });
  },

  getDailyRevenue: () => {
    const { dailyRevenue } = get();
    return dailyRevenue;
  },

  getDailyProfit: () => {
    const { dailyProfit } = get();
    return dailyProfit;
  },
}));

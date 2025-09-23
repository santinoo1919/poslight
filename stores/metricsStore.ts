import { create } from "zustand";
import { db } from "../services/tinybaseStore";

interface MetricsState {
  dailyRevenue: number;
  dailyProfit: number;
  lastUpdatedDate: string | null;

  // Actions
  recordSale: (revenue: number, profit: number) => void;
  resetDaily: () => void;
  loadMetrics: () => void;
}

export const useMetricsStore = create<MetricsState>((set, get) => {
  return {
    dailyRevenue: 0,
    dailyProfit: 0,
    lastUpdatedDate: null,

    recordSale: (revenue: number, profit: number) => {
      console.log("💰 Recording sale:", { revenue, profit });

      // Update TinyBase (single source of truth)
      db.updateDailyMetrics(revenue, profit);

      // Update Zustand state from TinyBase
      get().loadMetrics();
    },

    resetDaily: () => {
      const today = new Date().toISOString().split("T")[0];

      // Reset in TinyBase
      db.updateDailyMetrics(-get().dailyRevenue, -get().dailyProfit);

      // Update Zustand state
      set({
        dailyRevenue: 0,
        dailyProfit: 0,
        lastUpdatedDate: today,
      });
    },

    loadMetrics: () => {
      const metrics = db.getDailyMetrics();
      const today = new Date().toISOString().split("T")[0];

      console.log("📊 Loading metrics:", {
        metrics,
        today,
        revenue: metrics.revenue,
        profit: metrics.profit,
      });

      set({
        dailyRevenue: metrics.revenue,
        dailyProfit: metrics.profit,
        lastUpdatedDate: today,
      });
    },
  };
});

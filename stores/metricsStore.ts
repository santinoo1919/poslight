import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MetricsState {
  dailyRevenue: number;
  dailyProfit: number;
  lastUpdatedDate: string | null;

  // Actions
  recordSale: (revenue: number, profit: number) => void;
  resetDaily: () => void;
  recalculateFromLocalTransactions: () => void;
  loadPersistedMetrics: () => Promise<void>;
}

const STORAGE_KEY = "daily_metrics";

export const useMetricsStore = create<MetricsState>((set, get) => ({
  dailyRevenue: 0,
  dailyProfit: 0,
  lastUpdatedDate: null,

  recordSale: (revenue: number, profit: number) => {
    const { dailyRevenue, dailyProfit, lastUpdatedDate } = get();
    const today = new Date().toISOString().split("T")[0];

    // Check if it's a new day and reset if needed
    if (lastUpdatedDate !== today) {
      set({
        dailyRevenue: revenue,
        dailyProfit: profit,
        lastUpdatedDate: today,
      });
    } else {
      set({
        dailyRevenue: dailyRevenue + revenue,
        dailyProfit: dailyProfit + profit,
        lastUpdatedDate: today,
      });
    }

    // Persist to AsyncStorage
    const state = get();
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dailyRevenue: state.dailyRevenue,
        dailyProfit: state.dailyProfit,
        lastUpdatedDate: state.lastUpdatedDate,
      })
    ).catch((error) => {
      console.warn("Failed to save metrics:", error);
    });
  },

  resetDaily: () => {
    set({ dailyRevenue: 0, dailyProfit: 0, lastUpdatedDate: null });
    AsyncStorage.removeItem(STORAGE_KEY).catch((error) => {
      console.warn("Failed to clear metrics:", error);
    });
  },

  recalculateFromLocalTransactions: () => {
    const { db } = require("../services/tinybaseStore");
    const transactions = db.getTodayTransactions();
    const today = new Date().toISOString().split("T")[0];

    const revenue = transactions.reduce(
      (sum, transaction) => sum + (transaction.total_amount || 0),
      0
    );

    // For now, set profit to 0 since we don't have buy prices in transactions
    // TODO: Get buy prices from inventory when available
    const profit = 0;

    set({
      dailyRevenue: revenue,
      dailyProfit: profit,
      lastUpdatedDate: today,
    });

    // Persist to AsyncStorage
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dailyRevenue: revenue,
        dailyProfit: profit,
        lastUpdatedDate: today,
      })
    ).catch((error) => {
      console.warn("Failed to save metrics:", error);
    });
  },

  // Load persisted metrics on app start
  loadPersistedMetrics: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toISOString().split("T")[0];

        // Only use persisted data if it's from today
        if (data.lastUpdatedDate === today) {
          set({
            dailyRevenue: data.dailyRevenue || 0,
            dailyProfit: data.dailyProfit || 0,
            lastUpdatedDate: data.lastUpdatedDate,
          });
        } else {
          // Reset for new day
          set({ dailyRevenue: 0, dailyProfit: 0, lastUpdatedDate: null });
        }
      }
    } catch (error) {
      console.error("Failed to load persisted metrics:", error);
    }
  },
}));

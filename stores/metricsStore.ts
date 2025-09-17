import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MetricsState {
  dailyRevenue: number;
  dailyProfit: number;
  lastUpdatedDate: string | null;

  // Actions
  calculateDailyMetrics: (sales: any[]) => void;
  loadPersistedMetrics: () => Promise<void>;
  resetDaily: () => void;
  getDailyRevenue: () => number;
  getDailyProfit: () => number;
}

const STORAGE_KEY = "daily_metrics";

export const useMetricsStore = create<MetricsState>((set, get) => ({
  dailyRevenue: 0,
  dailyProfit: 0,
  lastUpdatedDate: null,

  calculateDailyMetrics: (sales: any[]) => {
    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((sale) =>
      sale.created_at.startsWith(today)
    );

    const revenue = todaySales.reduce(
      (sum, sale) => sum + (sale.total_amount || 0),
      0
    );
    const profit = todaySales.reduce((sum, sale) => {
      const itemProfit =
        sale.sale_items?.reduce((itemSum: number, item: any) => {
          // Use real cost data from inventory
          const buyPrice = item.inventory?.buy_price || 0;
          const sellPrice = item.unit_price || 0;
          const quantity = item.quantity || 0;

          // Calculate real profit: (sell_price - buy_price) * quantity
          const itemProfit = (sellPrice - buyPrice) * quantity;
          return itemSum + itemProfit;
        }, 0) || 0;
      return sum + itemProfit;
    }, 0);

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
    );
  },

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

  resetDaily: () => {
    set({ dailyRevenue: 0, dailyProfit: 0, lastUpdatedDate: null });
    AsyncStorage.removeItem(STORAGE_KEY);
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

import { create } from "zustand";
import { db } from "../services/tinybaseStore";

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

export const useMetricsStore = create<MetricsState>((set, get) => {
  return {
    dailyRevenue: 0,
    dailyProfit: 0,
    lastUpdatedDate: null,

    recordSale: (revenue: number, profit: number) => {
      const { dailyRevenue, dailyProfit } = get();
      const newState = {
        dailyRevenue: dailyRevenue + revenue,
        dailyProfit: dailyProfit + profit,
        lastUpdatedDate: new Date().toISOString().split("T")[0],
      };

      set(newState);
      // Update TinyBase store
      db.updateDailyMetrics(newState.dailyRevenue, newState.dailyProfit);
    },

    resetDaily: () => {
      const newState = {
        dailyRevenue: 0,
        dailyProfit: 0,
        lastUpdatedDate: new Date().toISOString().split("T")[0],
      };

      set(newState);
      // Update TinyBase store
      db.updateDailyMetrics(0, 0);
    },

    recalculateFromLocalTransactions: () => {
      const transactions = db.getTodayTransactions();
      const today = new Date().toISOString().split("T")[0];

      const revenue = transactions.reduce(
        (sum, transaction) => sum + (transaction.total_amount || 0),
        0
      );

      // Calculate profit from transaction items using actual buy prices
      const profit = transactions.reduce((totalProfit, transaction) => {
        const transactionItems = db.getTransactionItems(transaction.id);

        const transactionProfit = transactionItems.reduce((itemSum, item) => {
          const sellPrice = item.unit_price || 0;
          const quantity = item.quantity || 0;

          // Get the buy price from inventory data
          const inventoryData = db.getInventoryForProduct(item.product_id);
          const buyPrice = inventoryData?.buy_price || 0;

          const itemProfit = (sellPrice - buyPrice) * quantity;

          return itemSum + itemProfit;
        }, 0);

        return totalProfit + transactionProfit;
      }, 0);

      const newState = {
        dailyRevenue: revenue,
        dailyProfit: profit,
        lastUpdatedDate: today,
      };

      set(newState);
      // Update TinyBase store
      db.updateDailyMetrics(revenue, profit);
    },

    loadPersistedMetrics: async () => {
      const today = new Date().toISOString().split("T")[0];
      const metrics = db.getDailyMetrics();

      if (metrics) {
        // Check if we need to reset for new day
        if (metrics.lastUpdated && !metrics.lastUpdated.startsWith(today)) {
          const newState = {
            dailyRevenue: 0,
            dailyProfit: 0,
            lastUpdatedDate: today,
          };
          set(newState);
          db.updateDailyMetrics(0, 0);
        } else {
          set({
            dailyRevenue: metrics.revenue,
            dailyProfit: metrics.profit,
            lastUpdatedDate: today,
          });
        }
      }
    },
  };
});

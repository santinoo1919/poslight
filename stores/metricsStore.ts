import { create } from "zustand";
import { usePersistence } from "../utils/persistence";

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
  const persistence = usePersistence("metrics-store");

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
      persistence.save(newState);
    },

    resetDaily: () => {
      const newState = {
        dailyRevenue: 0,
        dailyProfit: 0,
        lastUpdatedDate: new Date().toISOString().split("T")[0],
      };

      set(newState);
      persistence.save(newState);
    },

    recalculateFromLocalTransactions: () => {
      const { db } = require("../services/tinybaseStore");
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
      persistence.save(newState);
    },

    loadPersistedMetrics: async () => {
      const today = new Date().toISOString().split("T")[0];
      const persisted = await persistence.load();

      if (persisted) {
        // Check if we need to reset for new day
        if (persisted.lastUpdatedDate !== today) {
          const newState = {
            dailyRevenue: 0,
            dailyProfit: 0,
            lastUpdatedDate: today,
          };
          set(newState);
          persistence.save(newState);
        } else {
          set(persisted);
        }
      }
    },
  };
});

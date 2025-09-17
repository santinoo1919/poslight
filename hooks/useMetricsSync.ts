// hooks/useMetricsSync.ts
import { useEffect } from "react";
import { useSalesQuery } from "./useSalesQuery";
import { useMetricsStore } from "../stores/metricsStore";

export const useMetricsSync = () => {
  const { data: sales, isLoading } = useSalesQuery();
  const { calculateDailyMetrics, loadPersistedMetrics } = useMetricsStore();

  // Load persisted metrics on mount
  useEffect(() => {
    loadPersistedMetrics();
  }, [loadPersistedMetrics]);

  // Update metrics when sales data changes
  useEffect(() => {
    if (sales && !isLoading) {
      calculateDailyMetrics(sales);
    }
  }, [sales, isLoading, calculateDailyMetrics]);

  return { isLoading };
};

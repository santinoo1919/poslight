import { useState, useEffect } from "react";
import { loadStore } from "../services/tinybaseStore";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";
import { useMetricsStore } from "../stores/metricsStore";
import { TransactionQueue } from "../services/transactionQueue";

export const useAppInitialization = () => {
  const [isReady, setIsReady] = useState(false);

  const { initializeProducts } = useProductStore();
  const { checkFaceIdAvailability, loadAuth } = useAuthStore();
  const { loadTheme } = useTheme();
  const { loadMetrics } = useMetricsStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🔄 Starting app initialization...");
        await loadStore();
        await TransactionQueue.loadQueue(); // Load recovery queue
        await loadTheme();
        await loadAuth(); // Load persisted auth state
        loadMetrics(); // Load metrics from TinyBase
        await initializeProducts();
        await checkFaceIdAvailability();
        console.log("✅ App initialization complete");
        setIsReady(true);
      } catch (error) {
        console.error("❌ App initialization failed:", error);
        // Still set ready to prevent infinite loading
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  return { isReady };
};

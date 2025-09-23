import { useState, useEffect } from "react";
import { loadStore } from "../services/tinybaseStore";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";
import { useMetricsStore } from "../stores/metricsStore";

export const useAppInitialization = () => {
  const [isReady, setIsReady] = useState(false);

  const { initializeProducts } = useProductStore();
  const { checkFaceIdAvailability, loadAuth } = useAuthStore();
  const { loadTheme } = useTheme();
  const { loadMetrics } = useMetricsStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadStore();
      await loadTheme();
      await loadAuth(); // Load persisted auth state
      loadMetrics(); // Load metrics from TinyBase
      await initializeProducts();
      await checkFaceIdAvailability();
      setIsReady(true);
    };

    initializeApp();
  }, []);

  return { isReady };
};

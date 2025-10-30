import { useState, useEffect } from "react";
import { Platform } from "react-native";
import { loadStore } from "../services/tinybaseStore";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";
import { useMetricsStore } from "../stores/metricsStore";
import { TransactionQueue } from "../services/transactionQueue";
import { shouldEnableBiometric } from "../utils/platform";

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
        console.log("🌐 Platform:", Platform.OS);

        await loadStore();
        await TransactionQueue.loadQueue(); // Load recovery queue
        await loadTheme();
        await loadAuth(); // Load persisted auth state
        loadMetrics(); // Load metrics from TinyBase
        await initializeProducts();

        // Only check FaceID availability on native platforms
        if (shouldEnableBiometric()) {
          console.log("🔐 Checking FaceID availability...");
          await checkFaceIdAvailability();
        } else {
          console.log("🌐 Skipping FaceID check on web platform");
        }

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

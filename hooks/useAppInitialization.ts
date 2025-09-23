import { useState, useEffect } from "react";
import { loadStore } from "../services/tinybaseStore";
import { useProductStore } from "../stores/productStore";
import { useAuthStore } from "../stores/authStore";
import { useTheme } from "../stores/themeStore";

export const useAppInitialization = () => {
  const [isReady, setIsReady] = useState(false);

  const { initializeProducts } = useProductStore();
  const { checkFaceIdAvailability } = useAuthStore();
  const { loadTheme } = useTheme();

  useEffect(() => {
    const initializeApp = async () => {
      await loadStore();
      await loadTheme();
      await initializeProducts();
      await checkFaceIdAvailability();
      setIsReady(true);
    };

    initializeApp();
  }, []);

  return { isReady };
};

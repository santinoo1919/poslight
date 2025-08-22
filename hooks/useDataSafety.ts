import { useCallback } from "react";
import { ensureDataIntegrity, safeGetProduct } from "../utils/dataValidation";
import {
  validateProduct,
  validateProducts,
  getValidationErrors,
} from "../utils/schemas";

export const useDataSafety = () => {
  // Validate data before rendering
  const validateBeforeRender = useCallback(
    (data: any, type: "products" | "categories") => {
      if (!data || data.length === 0) {
        console.warn("⚠️ No data to validate");
        return false;
      }

      return ensureDataIntegrity(data, type);
    },
    []
  );

  // Safe product access with fallbacks
  const getSafeProduct = useCallback((product: any) => {
    return safeGetProduct(product);
  }, []);

  // Check if data structure is safe for rendering
  const isDataSafeForRendering = useCallback((data: any) => {
    if (!data) return false;
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;

    // Use Zod validation for comprehensive safety check
    const result = validateProducts(data);
    if (!result.success) {
      console.error(
        "❌ Data unsafe:",
        result.error.issues
          .slice(0, 3)
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      );
      return false;
    }

    return true;
  }, []);

  // Zod-specific validation methods
  const validateProductWithZod = useCallback((product: any) => {
    return validateProduct(product);
  }, []);

  const validateProductsWithZod = useCallback((products: any[]) => {
    return validateProducts(products);
  }, []);

  return {
    validateBeforeRender,
    getSafeProduct,
    isDataSafeForRendering,
    validateProductWithZod,
    validateProductsWithZod,
  };
};

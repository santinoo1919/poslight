import { useCallback } from 'react';
import { ensureDataIntegrity, safeGetProduct } from '../utils/dataValidation';

export const useDataSafety = () => {
  // Validate data before rendering
  const validateBeforeRender = useCallback((data: any, type: 'products' | 'categories') => {
    if (!data || data.length === 0) {
      console.warn("⚠️ No data to validate");
      return false;
    }
    
    return ensureDataIntegrity(data, type);
  }, []);

  // Safe product access with fallbacks
  const getSafeProduct = useCallback((product: any) => {
    return safeGetProduct(product);
  }, []);

  // Check if data structure is safe for rendering
  const isDataSafeForRendering = useCallback((data: any) => {
    if (!data) return false;
    if (!Array.isArray(data)) return false;
    if (data.length === 0) return false;
    
    // Check if first item has required fields
    const firstItem = data[0];
    if (!firstItem || !firstItem.id) {
      console.error("❌ Data unsafe: missing ID field");
      return false;
    }
    
    return true;
  }, []);

  return {
    validateBeforeRender,
    getSafeProduct,
    isDataSafeForRendering,
  };
};

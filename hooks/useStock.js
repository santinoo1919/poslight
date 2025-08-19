import { useCallback } from "react";
import { useStore } from "tinybase/ui-react";
import StockManager from "../services/stock/StockManager";
import { store } from "../services/tinybaseStore";

// Create stock manager instance
const stockManager = new StockManager(store);

export default function useStock() {
  // Get stock level for a product (reactive)
  const getStockLevel = useCallback((productId) => {
    return stockManager.getStockLevel(productId);
  }, []);

  // Check if we can sell a product
  const canSell = useCallback((productId, quantity) => {
    return stockManager.canSell(productId, quantity);
  }, []);

  // Sell a product (decrement stock)
  const sellProduct = useCallback((productId, quantity) => {
    return stockManager.sellProduct(productId, quantity);
  }, []);

  // Restock a product (increment stock)
  const restockProduct = useCallback((productId, quantity) => {
    return stockManager.restockProduct(productId, quantity);
  }, []);

  // Check if stock is low
  const isLowStock = useCallback((productId) => {
    return stockManager.isLowStock(productId);
  }, []);

  // Get all low stock items
  const getLowStockItems = useCallback(() => {
    return stockManager.getLowStockItems();
  }, []);

  // Update stock level directly
  const updateStock = useCallback((productId, newStock) => {
    return stockManager.updateStock(productId, newStock);
  }, []);

  return {
    getStockLevel,
    canSell,
    sellProduct,
    restockProduct,
    isLowStock,
    getLowStockItems,
    updateStock,
  };
}

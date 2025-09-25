import { useCartStore } from "../stores/cartStore";
import { ToastService } from "../services/toastService";
import { validateStockUpdate } from "../utils/validation";

export const useStockOperations = () => {
  const { selectedProducts, removeFromCart } = useCartStore();

  const handleUpdateStock = async () => {
    // Final validation before stock update
    for (const product of selectedProducts) {
      if (product.quantity <= 0) {
        ToastService.stock.insufficient(product.name, product.quantity, 0);
        return;
      }
    }

    // Store selected products before clearing cart
    const productsToUpdate = [...selectedProducts];

    // Update stock in TinyBase (single source of truth)
    const { db } = require("../services/tinybaseStore");

    for (const product of productsToUpdate) {
      const oldStock = product.inventory?.stock || 0;
      const stockToAdd = product.quantity;
      const newStock = oldStock + stockToAdd;

      // Validate stock update
      const validationResult = validateStockUpdate({
        productId: product.id,
        newStock,
        oldStock,
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join(", ");
        ToastService.show("error", "Invalid Stock Update", errorMessage);
        return;
      }

      // Update stock in TinyBase (add to existing)
      db.updateStock(product.id, newStock);

      // Add stock update record for audit trail
      db.addStockUpdate(product.id, oldStock, newStock);
    }

    // Sync inventory state from TinyBase to ensure consistency
    const { useProductStore } = require("../stores/productStore");
    const { syncInventoryFromTinyBase } = useProductStore.getState();
    syncInventoryFromTinyBase();

    // Clear the cart
    selectedProducts.forEach((product) => removeFromCart(product.id));

    // Show success message
    ToastService.show(
      "success",
      "Stock Updated",
      `Added stock to ${productsToUpdate.length} products`
    );

    // // Prepare sync data for database (only if online)
    // try {
    //   const stockUpdates = productsToUpdate.map((product) => {
    //     const oldStock = product.inventory?.stock || 0;
    //     const stockToAdd = product.quantity;
    //     const newStock = oldStock + stockToAdd;

    //     return {
    //       product_id: product.id,
    //       old_stock: oldStock,
    //       new_stock: newStock,
    //       created_at: new Date().toISOString(),
    //     };
    //   });

    //   console.log("🔄 Starting stock sync with data:", stockUpdates);

    //   // Sync each stock update
    //   await Promise.all(
    //     stockUpdates.map((update) => syncStockUpdate.mutateAsync(update))
    //   );

    //   console.log("✅ All stock updates synced successfully");
    // } catch (error) {
    //   console.error("❌ Stock sync failed:", error);
    //   // Updates will retry automatically when online
    // }
  };

  return {
    handleUpdateStock,
  };
};

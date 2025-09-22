import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { ToastService } from "../services/toastService";
// import { useSyncStockUpdate } from "./useSyncMutations";

export const useStockOperations = () => {
  const { selectedProducts, removeFromCart } = useCartStore();
  // const syncStockUpdate = useSyncStockUpdate();

  const handleUpdateStock = async () => {
    // Final validation before stock update
    for (const product of selectedProducts) {
      if (product.quantity < 0) {
        ToastService.stock.insufficient(product.name, product.quantity, 0);
        return;
      }
    }

    // Store selected products before clearing cart
    const productsToUpdate = [...selectedProducts];

    // Get user ID for sync
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) return;

    // Update stock locally first
    const { db } = require("../services/tinybaseStore");

    for (const product of productsToUpdate) {
      const oldStock = product.inventory?.stock || 0;
      const stockToAdd = product.quantity;
      const newStock = oldStock + stockToAdd;

      // Update local stock (add to existing)
      db.updateStock(product.id, newStock);

      // Add stock update record for sync
      db.addStockUpdate(product.id, oldStock, newStock);
    }

    // Update local product store for immediate UI refresh (same as sales)
    const { useProductStore } = require("../stores/productStore");
    const { setInventory, inventory: currentInventory } =
      useProductStore.getState();

    // Update inventory array (this is what the UI reads from)
    const updatedInventory = [...(currentInventory || [])];

    productsToUpdate.forEach((product) => {
      const oldStock = product.inventory?.stock || 0;
      const stockToAdd = product.quantity;
      const newStock = oldStock + stockToAdd;

      // Find and update inventory item
      const existingIndex = updatedInventory.findIndex(
        (item) => item.product_id === product.id
      );

      if (existingIndex >= 0) {
        updatedInventory[existingIndex] = {
          ...updatedInventory[existingIndex],
          stock: newStock,
          updated_at: new Date().toISOString(),
        };
      }
    });

    setInventory(updatedInventory);

    // Clear the cart
    selectedProducts.forEach((product) => removeFromCart(product.id));

    // TODO: Reintroduce sync logic later when needed
    console.log("✅ Stock updated locally - sync disabled for standalone mode");

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

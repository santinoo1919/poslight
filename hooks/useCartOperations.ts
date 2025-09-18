import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { ToastService } from "../services/toastService";
import {
  useSyncSale,
  useSyncSaleItems,
  useSyncInventory,
} from "./useSyncMutations";

export const useCartOperations = () => {
  const { selectedProducts, completeSale, getTotalAmount } = useCartStore();

  const syncSale = useSyncSale();
  const syncSaleItems = useSyncSaleItems();
  const syncInventory = useSyncInventory();

  const handleCompleteSale = async () => {
    // Final validation before sale
    for (const product of selectedProducts) {
      const stock = product.inventory?.stock ?? 0;
      if (product.quantity > stock) {
        ToastService.stock.insufficient(product.name, product.quantity, stock);
        return;
      }
    }

    // Store selected products before clearing cart
    const productsToSync = [...selectedProducts];

    // Complete the sale (this updates local state immediately and clears cart)
    completeSale();

    // Prepare sync data for database (only if online)
    const { user } = useAuthStore.getState();
    const userId = user?.id;

    if (!userId) return;

    const totalAmount = productsToSync.reduce(
      (sum, product) =>
        sum + (product.inventory?.sell_price || 0) * product.quantity,
      0
    );

    const saleId = crypto.randomUUID();

    const saleData = {
      id: saleId,
      user_id: userId,
      total_amount: totalAmount,
      payment_method: "cash",
      status: "completed",
      created_at: new Date().toISOString(),
    };

    const saleItems = productsToSync.map((product) => ({
      sale_id: saleId,
      inventory_id: product.inventory?.id,
      product_id: product.id,
      quantity: product.quantity,
      unit_price: product.inventory?.sell_price || 0,
      total_price: (product.inventory?.sell_price || 0) * product.quantity,
    }));

    const inventoryUpdates = productsToSync.map((product) => ({
      product_id: product.id,
      user_id: userId,
      stock: (product.inventory?.stock || 0) - product.quantity,
      buy_price: product.inventory?.buy_price || 0,
      sell_price: product.inventory?.sell_price || 0,
      is_active: true,
      updated_at: new Date().toISOString(),
    }));

    // Queue sync mutations (will retry when online)
    console.log("🔄 Starting sync with data:", {
      saleData,
      saleItems,
      inventoryUpdates,
    });

    try {
      await Promise.all([
        syncSale.mutateAsync(saleData),
        syncSaleItems.mutateAsync(saleItems),
        syncInventory.mutateAsync(inventoryUpdates),
      ]);
      console.log("✅ All sync mutations completed successfully");
    } catch (error) {
      console.error("❌ Sync failed:", error);
      // Mutations will retry automatically when online
    }
  };

  return {
    handleCompleteSale,
    getTotalAmount,
  };
};

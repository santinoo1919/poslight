import { useAuthStore } from "../stores/authStore";
import { useCartStore } from "../stores/cartStore";
import { ToastService } from "../services/toastService";
// import {
//   useSyncSale,
//   useSyncSaleItems,
//   useSyncInventory,
// } from "./useSyncMutations";
import * as Crypto from "expo-crypto";

export const useCartOperations = () => {
  const { selectedProducts, completeSale, getTotalAmount } = useCartStore();

  // const syncSale = useSyncSale();
  // const syncSaleItems = useSyncSaleItems();
  // const syncInventory = useSyncInventory();

  const handleCompleteSale = async () => {
    console.log("🚀 Starting sale completion process...");
    console.log("📦 Selected products:", selectedProducts);
    console.log("💰 Total amount:", getTotalAmount());

    // Final validation before sale
    for (const product of selectedProducts) {
      const stock = product.inventory?.stock ?? 0;
      console.log(`🔍 Checking stock for ${product.name}:`, {
        required: product.quantity,
        available: stock,
        sufficient: product.quantity <= stock,
      });

      if (product.quantity > stock) {
        console.error("❌ Insufficient stock for:", product.name);
        ToastService.stock.insufficient(product.name, product.quantity, stock);
        return;
      }
    }

    console.log("✅ Stock validation passed");

    // Store selected products before clearing cart
    const productsToSync = [...selectedProducts];
    console.log("📋 Products to sync:", productsToSync);

    // Complete the sale (this updates local state immediately and clears cart)
    console.log("🔄 Calling completeSale from store...");
    try {
      completeSale();
      console.log("✅ Sale completed in store successfully");
    } catch (error) {
      console.error("❌ Error in completeSale:", error);
      throw error;
    }

    // TODO: Reintroduce sync logic later when needed
    console.log(
      "✅ Sale completed locally - sync disabled for standalone mode"
    );

    // // Prepare sync data for database (only if online)
    // const { user } = useAuthStore.getState();
    // const userId = user?.id;
    // console.log("👤 User ID:", userId);

    // if (!userId) {
    //   console.warn("⚠️ No user ID found, skipping sync");
    //   return;
    // }

    // const totalAmount = productsToSync.reduce(
    //   (sum, product) =>
    //     sum + (product.inventory?.sell_price || 0) * product.quantity,
    //   0
    // );
    // console.log("💰 Calculated total amount:", totalAmount);

    // const saleId = Crypto.randomUUID();
    // console.log("🆔 Generated sale ID:", saleId);

    // const saleData = {
    //   id: saleId,
    //   user_id: userId,
    //   total_amount: totalAmount,
    //   payment_method: "cash",
    //   status: "completed",
    //   created_at: new Date().toISOString(),
    // };
    // console.log("📊 Sale data:", saleData);

    // const saleItems = productsToSync.map((product) => ({
    //   sale_id: saleId,
    //   inventory_id: product.inventory?.id,
    //   product_id: product.id,
    //   quantity: product.quantity,
    //   unit_price: product.inventory?.sell_price || 0,
    //   total_price: (product.inventory?.sell_price || 0) * product.quantity,
    // }));
    // console.log("🛒 Sale items:", saleItems);

    // const inventoryUpdates = productsToSync.map((product) => ({
    //   product_id: product.id,
    //   user_id: userId,
    //   stock: (product.inventory?.stock || 0) - product.quantity,
    //   buy_price: product.inventory?.buy_price || 0,
    //   sell_price: product.inventory?.sell_price || 0,
    //   is_active: true,
    //   updated_at: new Date().toISOString(),
    // }));
    // console.log("📦 Inventory updates:", inventoryUpdates);

    // // Queue sync mutations (will retry when online)
    // console.log("🔄 Starting sync with data:", {
    //   saleData,
    //   saleItems,
    //   inventoryUpdates,
    // });

    // try {
    //   console.log("🔄 Calling sync mutations...");
    //   await Promise.all([
    //     syncSale.mutateAsync(saleData),
    //     syncSaleItems.mutateAsync(saleItems),
    //     syncInventory.mutateAsync(inventoryUpdates),
    //   ]);
    //   console.log("✅ All sync mutations completed successfully");
    // } catch (error) {
    //   console.error("❌ Sync failed:", error);
    //   console.error("❌ Error details:", {
    //     message: error.message,
    //     stack: error.stack,
    //     name: error.name,
    //   });
    //   // Mutations will retry automatically when online
    // }
  };

  return {
    handleCompleteSale,
    getTotalAmount,
  };
};

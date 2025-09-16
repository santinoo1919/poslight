// hooks/useSyncMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useSyncSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleData: any) => {
      console.log("🔄 Syncing sale:", saleData);
      const { data, error } = await supabase.from("sales").insert(saleData);
      if (error) {
        console.error("❌ Sale sync error:", error);
        throw error;
      }
      console.log("✅ Sale synced successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("✅ Sale sync success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
    onError: (error) => {
      console.error("❌ Sale sync failed:", error);
    },
  });
};

export const useSyncSaleItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleItems: any[]) => {
      const { data, error } = await supabase
        .from("sale_items")
        .insert(saleItems);
      if (error) {
        console.error("❌ Sale items sync error:", error);
        throw error;
      }
      console.log("✅ Sale items synced successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("✅ Sale items sync success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["sale_items"] });
    },
    onError: (error) => {
      console.error("❌ Sale items sync failed:", error);
    },
  });
};

export const useSyncInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryUpdates: any[]) => {
      console.log("🔄 Syncing inventory:", inventoryUpdates);
      const { data, error } = await supabase
        .from("inventory")
        .upsert(inventoryUpdates, {
          onConflict: "product_id,user_id",
          ignoreDuplicates: false,
        });
      if (error) {
        console.error("❌ Inventory sync error:", error);
        throw error;
      }
      console.log("✅ Inventory synced successfully:", data);
      return data;
    },
    onSuccess: () => {
      console.log("✅ Inventory sync success, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error) => {
      console.error("❌ Inventory sync failed:", error);
    },
  });
};

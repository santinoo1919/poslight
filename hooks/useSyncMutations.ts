// hooks/useSyncMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useSyncSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleData: any) => {
      const { data, error } = await supabase.from("sales").insert([saleData]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
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
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sale_items"] });
    },
  });
};

export const useSyncInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inventoryUpdates: any[]) => {
      const { data, error } = await supabase
        .from("inventory")
        .upsert(inventoryUpdates, {
          onConflict: "product_id,user_id",
          ignoreDuplicates: false,
        });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

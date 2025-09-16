import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { store } from "../services/tinybaseStore";

export const useInventoryQuery = (
  userId: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["inventory", userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("inventory")
          .select("*,products:product_id(*)")
          .eq("user_id", userId)
          .eq("is_active", true);

        if (error) throw error;

        // Update TinyBase with fresh data AND return it
        if (data && data.length > 0) {
          const inventoryMap: Record<string, any> = {};
          data.forEach((item) => {
            inventoryMap[item.product_id] = item;
          });
          store.setTable("inventory", inventoryMap);
          return data; // Return Supabase data when online
        }

        return data || [];
      } catch (error) {
        // If online fetch fails, return TinyBase data
        const tinybaseInventory = store.getTable("inventory");
        const cachedInventory = Object.entries(tinybaseInventory)
          .map(([id, item]) => ({ ...item, id: id }))
          .filter((item: any) => item.user_id === userId && item.is_active);

        return cachedInventory;
      }
    },
    staleTime: 30 * 1000, // 30 seconds (inventory changes frequently)
    refetchOnWindowFocus: true, // Refetch when coming back online
    enabled: options?.enabled ?? !!userId,
  });
};

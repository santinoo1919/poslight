import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useInventoryQuery = (userId: string) => {
  return useQuery({
    queryKey: ["inventory", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*,products:product_id(*)")
        .eq("user_id", userId)
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (changes more frequently)
  });
};

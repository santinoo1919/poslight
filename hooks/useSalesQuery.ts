// hooks/useSalesQuery.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";

// hooks/useSalesQuery.ts
export const useSalesQuery = () => {
  const { user } = useAuthStore();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  return useQuery({
    queryKey: ["sales", user?.id, today],
    queryFn: async () => {
      const { data: sales, error } = await supabase
        .from("sales")
        .select(
          `
            *,
            sale_items (
              id,
              product_id,
              quantity,
              unit_price,
              total_price,
              products (name),
              inventory (
                buy_price,
                sell_price
              )
            )
          `
        )
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .gte("created_at", `${today}T00:00:00`) // Today only
        .lte("created_at", `${today}T23:59:59`) // Today only
        .order("created_at", { ascending: false });

      if (error) throw error;
      return sales || [];
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

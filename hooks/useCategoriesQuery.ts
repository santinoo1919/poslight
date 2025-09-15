// hooks/useCategoriesQuery.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Product } from "../types/database";

export const useProductsQuery = (search?: string, category?: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", search, category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("name");
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,sku.ilike.%${search}%,barcode.ilike.%${search}%,category.name.ilike.%${search}%`
        );
      }
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

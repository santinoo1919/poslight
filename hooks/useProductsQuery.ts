import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { Product } from "../types/database";
import { store } from "../services/tinybaseStore";

export const useProductsQuery = (search?: string, category?: string) => {
  return useQuery<Product[], Error>({
    queryKey: ["products", search, category],
    queryFn: async () => {
      try {
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

        // Update TinyBase with fresh data AND return it
        if (data && data.length > 0) {
          const productsMap: Record<string, any> = {};
          data.forEach((product) => {
            productsMap[product.id] = product;
          });
          store.setTable("products", productsMap);
          return data; // Return Supabase data when online
        }

        // If no data from Supabase, return empty array
        return [];
      } catch (error) {
        // If online fetch fails, return TinyBase data
        const tinybaseProducts = store.getTable("products");
        const products = Object.entries(tinybaseProducts).map(
          ([id, product]) => ({
            ...product,
            id: id, // Ensure id is preserved
          })
        ) as unknown as Product[];
        return products;
      }
    },
    // Don't use initialData - let the query run first to populate TinyBase
    staleTime: 2 * 60 * 1000, // 2 minutes (products change less frequently)
    refetchOnWindowFocus: true, // Refetch when coming back online
  });
};

import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { store } from "../services/tinybaseStore";

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error) {
          throw new Error(error.message);
        }

        // Update TinyBase with fresh data AND return it
        if (data && data.length > 0) {
          const categoriesMap: Record<string, any> = {};
          data.forEach((category) => {
            categoriesMap[category.key] = category;
          });
          store.setTable("categories", categoriesMap);
          return data; // Return Supabase data when online
        }

        return data || [];
      } catch (error) {
        // If online fetch fails, return TinyBase data
        const tinybaseCategories = store.getTable("categories");
        const categories = Object.values(tinybaseCategories);
        return categories;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

import React from "react";
import { useProductsQuery } from "./useProductsQuery";
import { useCategoriesQuery } from "./useCategoriesQuery";
import { useProductStore } from "../stores/productStore";
import { useInventoryQuery } from "./useInventoryQuery";

export const useDataSync = (userId?: string) => {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useProductsQuery();
  const {
    data: inventory,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventoryQuery(userId || "", { enabled: !!userId });
  const { setProducts, setInventory, setLoading, setError } = useProductStore();

  const isLoading = productsLoading || inventoryLoading;
  const error = productsError || inventoryError;

  React.useEffect(() => {
    if (products) setProducts(products);
    if (inventory) setInventory(inventory);
    setLoading(isLoading);
    setError(error?.message || null);
  }, [
    products,
    inventory,
    isLoading,
    error,
    setProducts,
    setInventory,
    setLoading,
    setError,
  ]);

  return { products, inventory, isLoading, error };
};

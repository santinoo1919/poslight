// hooks/useSyncMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { syncQueue } from "../services/tinybaseStore";

export const useSyncSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleData: any) => {
      try {
        const { data, error } = await supabase.from("sales").insert(saleData);
        if (error) throw error;
        return data;
      } catch (error) {
        // Queue for later retry
        syncQueue.add({ type: "sale", data: saleData });
        throw error;
      }
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
      try {
        const { data, error } = await supabase
          .from("sale_items")
          .insert(saleItems);
        if (error) throw error;
        return data;
      } catch (error) {
        // Queue for later retry
        syncQueue.add({ type: "sale_items", data: saleItems });
        throw error;
      }
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
      try {
        const { data, error } = await supabase
          .from("inventory")
          .upsert(inventoryUpdates, {
            onConflict: "product_id,user_id",
            ignoreDuplicates: false,
          });
        if (error) throw error;
        return data;
      } catch (error) {
        // Queue for later retry
        syncQueue.add({ type: "inventory", data: inventoryUpdates });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};

// Background queue processor hook
export const useSyncQueueProcessor = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const processQueue = async () => {
      const pendingItems = syncQueue.getPending();

      if (pendingItems.length === 0) return;

      for (const item of pendingItems) {
        try {
          const data = JSON.parse(item.data as string);

          switch (item.type) {
            case "sale":
              const { error: saleError } = await supabase
                .from("sales")
                .insert(data);
              if (saleError) throw saleError;
              break;

            case "sale_items":
              const { error: itemsError } = await supabase
                .from("sale_items")
                .insert(data);
              if (itemsError) throw itemsError;
              break;

            case "inventory":
              const { error: invError } = await supabase
                .from("inventory")
                .upsert(data, {
                  onConflict: "product_id,user_id",
                  ignoreDuplicates: false,
                });
              if (invError) throw invError;
              break;
          }

          // Mark as completed
          syncQueue.markCompleted(item.id as string);
        } catch (error) {
          syncQueue.incrementRetry(item.id as string);

          // If too many retries, mark as failed (you could add a failed status)
          const updatedItem = syncQueue
            .getPending()
            .find((i) => i.id === item.id);
          if (updatedItem && (updatedItem.retryCount as number) >= 5) {
            syncQueue.markCompleted(item.id as string); // Remove from queue
          }
        }
      }

      // Cleanup completed items
      syncQueue.cleanup();
    };

    // Process queue every 30 seconds
    const interval = setInterval(processQueue, 30000);

    // Also process immediately when hook mounts
    processQueue();

    return () => clearInterval(interval);
  }, [queryClient]);
};

// Hook to get sync queue status
export const useSyncQueueStatus = () => {
  const [status, setStatus] = useState(syncQueue.getStatus());

  useEffect(() => {
    const updateStatus = () => {
      setStatus(syncQueue.getStatus());
    };

    const interval = setInterval(updateStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return status;
};

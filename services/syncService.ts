// services/syncService.ts
import { supabase } from "../lib/supabase";

interface QueuedChange {
  id: string;
  type: string;
  data: any;
  retryCount: number;
  maxRetries: number;
  timestamp: number;
}

class SyncService {
  private queue: QueuedChange[] = [];
  private isProcessing = false;
  private onSyncComplete?: () => void;

  addChange(change: any) {
    const queuedChange: QueuedChange = {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: change.type,
      data: change.data,
      retryCount: 0,
      maxRetries: 3,
      timestamp: Date.now(),
    };

    console.log("📝 Adding change to sync queue:", {
      type: change.type,
      data: change.data,
      queueLength: this.queue.length + 1,
    });

    this.queue.push(queuedChange);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    console.log(`🔄 Starting sync process with ${this.queue.length} items`);

    while (this.queue.length > 0) {
      const change = this.queue[0];
      console.log(
        `🔄 Processing ${change.type} (attempt ${change.retryCount + 1}/${change.maxRetries})`
      );

      try {
        await this.syncChange(change);
        this.queue.shift(); // Remove successful change
        console.log(`✅ Synced ${change.type} successfully`);
      } catch (error) {
        console.error(`❌ Sync failed for ${change.type}:`, error);

        change.retryCount++;

        if (change.retryCount >= change.maxRetries) {
          console.error(
            `🚫 Max retries exceeded for ${change.type}, removing from queue`
          );
          this.queue.shift(); // Remove failed change after max retries
        } else {
          // Move to end of queue for retry
          this.queue.push(this.queue.shift()!);
          console.log(
            `🔄 Retrying ${change.type} in 5 seconds (attempt ${change.retryCount}/${change.maxRetries})`
          );
          // Wait before continuing to process the next item
          await new Promise((resolve) => setTimeout(resolve, 5000));
          // Continue processing after retry delay
          continue;
        }
      }
    }

    this.isProcessing = false;
    console.log(
      `🔄 Sync process completed. Queue length: ${this.queue.length}`
    );

    // Call the completion callback if all items were processed
    if (this.queue.length === 0 && this.onSyncComplete) {
      this.onSyncComplete();
    }
  }

  private async syncChange(change: QueuedChange) {
    const { type, data } = change;

    console.log(`🔄 Attempting to sync ${type}:`, data);

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated for sync");
    }
    console.log("👤 User authenticated for sync:", user.id);

    try {
      if (type === "inventory") {
        console.log("📦 Syncing inventory data...");
        // Handle inventory updates one by one to avoid conflicts
        for (const item of data) {
          const { data: result, error } = await supabase
            .from("inventory")
            .upsert(item, {
              onConflict: "product_id,user_id",
              ignoreDuplicates: false,
            });
          if (error) {
            console.error("❌ Inventory item sync error:", error);
            throw error;
          }
          console.log("✅ Inventory item synced:", result);
        }
      } else if (type === "sale") {
        console.log("💰 Syncing sale data...");
        console.log("💰 Sale data being sent:", JSON.stringify(data, null, 2));
        const { data: result, error } = await supabase
          .from("sales")
          .insert([data]);
        if (error) {
          console.error("❌ Sale sync error:", error);
          console.error("❌ Error details:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
          throw error;
        }
        console.log("✅ Sale synced successfully:", result);
      } else if (type === "sale_item") {
        console.log("🛒 Syncing sale items data...");
        // Insert sale items one by one to handle RLS policies properly
        for (const item of data) {
          const { data: result, error } = await supabase
            .from("sale_items")
            .insert(item);
          if (error) {
            console.error("❌ Sale item sync error:", error);
            throw error;
          }
          console.log("✅ Sale item synced:", result);
        }
      } else {
        console.warn(`⚠️ Unknown sync type: ${type}`);
        return; // Skip unknown types instead of throwing
      }
    } catch (error) {
      console.error(`💥 Sync error for ${type}:`, error);

      // If it's a table doesn't exist error, just log and skip
      if (
        error?.message?.includes("relation") &&
        error?.message?.includes("does not exist")
      ) {
        console.warn(
          `Table for ${type} doesn't exist, skipping sync:`,
          error.message
        );
        return; // Don't throw, just skip
      }
      throw error; // Re-throw other errors
    }
  }

  getQueueLength() {
    return this.queue.length;
  }

  getQueueStatus() {
    return {
      length: this.queue.length,
      isProcessing: this.isProcessing,
      items: this.queue.map((item) => ({
        id: item.id,
        type: item.type,
        retryCount: item.retryCount,
        maxRetries: item.maxRetries,
        age: Date.now() - item.timestamp,
      })),
    };
  }

  setOnSyncComplete(callback: () => void) {
    this.onSyncComplete = callback;
  }
}

export const syncService = new SyncService();

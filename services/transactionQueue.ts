// services/transactionQueue.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../utils/validation";

export class TransactionQueue {
  private static queue: Transaction[] = [];

  static add(transaction: Transaction) {
    this.queue.push(transaction);

    // Save IMMEDIATELY after each add
    this.saveQueueImmediately();
  }

  static getTodayTransactions(): Transaction[] {
    const today = new Date().toISOString().split("T")[0];
    return this.queue.filter((tx) => tx.created_at.startsWith(today));
  }

  static clear() {
    this.queue = [];
    AsyncStorage.removeItem("transaction_queue");
    console.log("🧹 Transaction queue cleared - ready for tomorrow");
  }

  private static async saveQueueImmediately() {
    try {
      await AsyncStorage.setItem(
        "transaction_queue",
        JSON.stringify(this.queue)
      );
    } catch (error) {
      console.error("❌ Failed to save transaction queue:", error);
    }
  }

  static async loadQueue() {
    try {
      const saved = await AsyncStorage.getItem("transaction_queue");
      if (saved) {
        this.queue = JSON.parse(saved);
        console.log(
          `✅ Loaded ${this.queue.length} transactions from recovery queue`
        );
      }
    } catch (error) {
      console.error("❌ Failed to load transaction queue:", error);
    }
  }

  static getQueueSize(): number {
    return this.queue.length;
  }
}

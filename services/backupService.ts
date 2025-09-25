import * as FileSystem from "expo-file-system";
import { store, saveStore } from "./tinybaseStore";
import { TransactionQueue } from "./transactionQueue";

export interface BackupData {
  date: string;
  timestamp: string;
  version: string;
  data: {
    categories: Record<string, any>;
    products: Record<string, any>;
    inventory: Record<string, any>;
    transactions: Record<string, any>;
    transaction_items: Record<string, any>;
    stock_updates: Record<string, any>;
    sync_queue: Record<string, any>;
    dailyMetrics: Record<string, any>;
    cashflowMetrics: Record<string, any>;
  };
}

export class BackupService {
  private static readonly BACKUP_PREFIX = "backup_";
  private static readonly BACKUP_EXTENSION = ".json";
  private static readonly VERSION = "1.0";

  /**
   * Create a daily backup of all business data
   */
  static async createBackup(): Promise<string> {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Get all business data from TinyBase
      const backupData: BackupData = {
        date: today,
        timestamp: new Date().toISOString(),
        version: this.VERSION,
        data: {
          categories: store.getTable("categories"),
          products: store.getTable("products"),
          inventory: store.getTable("inventory"),
          transactions: store.getTable("transactions"),
          transaction_items: store.getTable("transaction_items"),
          stock_updates: store.getTable("stock_updates"),
          sync_queue: store.getTable("sync_queue"),
          dailyMetrics: store.getTable("dailyMetrics"),
          cashflowMetrics: store.getTable("cashflowMetrics"),
        },
      };

      // Create filename with timestamp
      const fileName = `${this.BACKUP_PREFIX}${today}_${Date.now()}${this.BACKUP_EXTENSION}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Write JSON to file
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(backupData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      console.log(`✅ Backup created: ${fileName}`);

      // Clear recovery queue after successful backup
      TransactionQueue.clear();

      return fileUri;
    } catch (error) {
      console.error("❌ Backup creation failed:", error);
      throw new Error(`Backup failed: ${error.message}`);
    }
  }

  /**
   * List all available backup files
   */
  static async listBackups(): Promise<string[]> {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      return files
        .filter(
          (file) =>
            file.startsWith(this.BACKUP_PREFIX) &&
            file.endsWith(this.BACKUP_EXTENSION)
        )
        .sort()
        .reverse(); // Most recent first
    } catch (error) {
      console.error("❌ Failed to list backups:", error);
      return [];
    }
  }

  /**
   * Get backup file info (size, date, etc.)
   */
  static async getBackupInfo(
    fileName: string
  ): Promise<{ size: number; date: string; timestamp: string } | null> {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        return null;
      }

      // Read backup to get metadata
      const backupContent = await FileSystem.readAsStringAsync(fileUri);
      const backupData: BackupData = JSON.parse(backupContent);

      return {
        size: fileInfo.size || 0,
        date: backupData.date,
        timestamp: backupData.timestamp,
      };
    } catch (error) {
      console.error("❌ Failed to get backup info:", error);
      return null;
    }
  }

  /**
   * Restore from a backup file
   */
  static async restoreFromBackup(fileName: string): Promise<void> {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      const backupContent = await FileSystem.readAsStringAsync(fileUri);
      const backupData: BackupData = JSON.parse(backupContent);

      console.log(`🔄 Restoring backup from ${backupData.date}...`);

      // Clear current data
      store.delTable("categories");
      store.delTable("products");
      store.delTable("inventory");
      store.delTable("transactions");
      store.delTable("transaction_items");
      store.delTable("stock_updates");
      store.delTable("sync_queue");
      store.delTable("dailyMetrics");
      store.delTable("cashflowMetrics");

      // Load backup data into TinyBase
      Object.entries(backupData.data.categories).forEach(([id, category]) => {
        store.setRow("categories", id, category);
      });

      Object.entries(backupData.data.products).forEach(([id, product]) => {
        store.setRow("products", id, product);
      });

      Object.entries(backupData.data.inventory).forEach(([id, inventory]) => {
        store.setRow("inventory", id, inventory);
      });

      Object.entries(backupData.data.transactions).forEach(
        ([id, transaction]) => {
          store.setRow("transactions", id, transaction);
        }
      );

      Object.entries(backupData.data.transaction_items).forEach(
        ([id, item]) => {
          store.setRow("transaction_items", id, item);
        }
      );

      Object.entries(backupData.data.stock_updates).forEach(
        ([id, stockUpdate]) => {
          store.setRow("stock_updates", id, stockUpdate);
        }
      );

      Object.entries(backupData.data.sync_queue).forEach(([id, queueItem]) => {
        store.setRow("sync_queue", id, queueItem);
      });

      Object.entries(backupData.data.dailyMetrics).forEach(([id, metric]) => {
        store.setRow("dailyMetrics", id, metric);
      });

      Object.entries(backupData.data.cashflowMetrics).forEach(
        ([id, metric]) => {
          store.setRow("cashflowMetrics", id, metric);
        }
      );

      // Save to persistent storage
      await saveStore();

      console.log(`✅ Backup restored successfully from ${backupData.date}`);
    } catch (error) {
      console.error("❌ Restore failed:", error);
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  /**
   * Delete a backup file
   */
  static async deleteBackup(fileName: string): Promise<void> {
    try {
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.deleteAsync(fileUri);
      console.log(`🗑️ Backup deleted: ${fileName}`);
    } catch (error) {
      console.error("❌ Failed to delete backup:", error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /**
   * Get backup file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

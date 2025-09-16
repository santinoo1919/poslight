// hooks/useSyncStatus.ts
import { useState, useEffect } from "react";
import { syncService } from "../services/syncService";

export const useSyncStatus = () => {
  const [queueLength, setQueueLength] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueItems, setQueueItems] = useState<any[]>([]);

  useEffect(() => {
    const updateStatus = () => {
      const status = syncService.getQueueStatus();
      setQueueLength(status.length);
      setIsProcessing(status.isProcessing);
      setQueueItems(status.items);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    queueLength,
    isSyncing: queueLength > 0 || isProcessing,
    isProcessing,
    queueItems,
    hasFailedItems: queueItems.some((item) => item.retryCount > 0),
  };
};

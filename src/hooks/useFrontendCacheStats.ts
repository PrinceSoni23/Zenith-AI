import { useState, useEffect } from "react";
import { cacheService } from "@/lib/cacheService";

export interface FrontendCacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  hitRate: number;
  cacheSize: number;
  maxCacheSize: number;
  cachedEntries: number;
}

/**
 * Hook to get frontend cache statistics
 * Updates in real-time as cache is used
 */
export function useFrontendCacheStats(refreshInterval: number = 1000) {
  const [stats, setStats] = useState<FrontendCacheStats | null>(null);

  useEffect(() => {
    // Get initial stats
    const initialStats = cacheService.getFrontendCacheStats();
    setStats(initialStats);

    // Set up interval to refresh stats
    const interval = setInterval(() => {
      const currentStats = cacheService.getFrontendCacheStats();
      setStats(currentStats);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return stats;
}

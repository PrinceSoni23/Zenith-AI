/**
 * Cache Management Hook
 * Provides utilities for managing the cache system
 */

import { cacheService } from "@/lib/cacheService";

export function useCacheManagement() {
  const getStats = () => {
    const stats = cacheService.getStats();
    return {
      totalSize: stats.totalSize,
      entriesCount: stats.entries.length,
      hitRate: cacheService.getHitRate(),
      hits: stats.hitCount,
      misses: stats.missCount,
      entries: stats.entries,
    };
  };

  const clearCache = () => {
    cacheService.clear();
  };

  const invalidateAgent = (agentType: string) => {
    cacheService.invalidateAgent(agentType);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return {
    getStats,
    clearCache,
    invalidateAgent,
    formatBytes,
  };
}

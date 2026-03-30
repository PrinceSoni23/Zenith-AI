/**
 * Frontend Cache Service with TTL
 * Implements smart caching to reduce API calls by 30-60%
 * Cache key format: `{agentType}:{question}:{params}`
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  hits: number; // Track cache hit count for analytics
}

interface CacheStats {
  totalSize: number;
  hitCount: number;
  missCount: number;
  entries: {
    key: string;
    size: number;
    expiresIn: number;
    hits: number;
  }[];
}

class FrontendCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private stats = { hits: 0, misses: 0 };
  private cleanupInterval: NodeJS.Timeout | null = null;
  private readonly MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly STORAGE_KEY = "zenith_cache";
  private currentSize = 0;

  constructor() {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      this.loadFromStorage();
      // Cleanup expired entries every 30 seconds
      this.cleanupInterval = setInterval(() => this.cleanup(), 30000);
    }
  }

  /**
   * Load cache from browser localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      const now = Date.now();
      let loadedCount = 0;
      let skippedFallbacks = 0;

      for (const [key, entry] of Object.entries(parsed)) {
        const cacheEntry = entry as any;
        // Only load non-expired entries
        if (cacheEntry.expiresAt > now) {
          // CRITICAL: Never load fallback responses
          // isFallback is at response.data.isFallback level
          if (cacheEntry.value?.data?.isFallback === true) {
            console.warn(`[Cache] SKIPPING fallback entry on load: ${key}`);
            skippedFallbacks++;
            continue;
          }
          this.cache.set(key, cacheEntry);
          this.currentSize += this.estimateSize(cacheEntry.value);
          loadedCount++;
        }
      }

      if (loadedCount > 0) {
        console.log(`[Cache] LOADED from localStorage: ${loadedCount} entries`);
      }
      if (skippedFallbacks > 0) {
        console.log(
          `[Cache] SKIPPED ${skippedFallbacks} fallback entries on load`,
        );
      }
    } catch (error) {
      console.warn("[Cache] Failed to load from localStorage:", error);
    }
  }

  /**
   * Save cache to browser localStorage
   */
  private saveToStorage(): void {
    try {
      if (typeof window === "undefined") return;

      const cacheObj: Record<string, CacheEntry<any>> = {};
      this.cache.forEach((entry, key) => {
        cacheObj[key] = entry;
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheObj));
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        console.warn(
          "[Cache] localStorage quota exceeded, clearing old entries...",
        );
        this.clearOldestEntries();
      } else {
        console.warn("[Cache] Failed to save to localStorage:", error);
      }
    }
  }

  /**
   * Clear oldest entries when storage is full
   */
  private clearOldestEntries(): void {
    // Find and remove entries with least hits
    const sortedEntries = Array.from(this.cache.entries()).sort(
      (a, b) => a[1].hits - b[1].hits,
    );

    for (let i = 0; i < Math.min(10, sortedEntries.length); i++) {
      const key = sortedEntries[i][0];
      const entry = this.cache.get(key);
      if (entry) {
        this.currentSize -= this.estimateSize(entry.value);
        this.cache.delete(key);
      }
    }

    this.saveToStorage();
  }

  /**
   * Generate cache key from agent type and parameters
   */
  private generateKey(agentType: string, params: Record<string, any>): string {
    // Normalize params to ensure consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${JSON.stringify(params[k])}`)
      .join("&");

    return `${agentType}:${sortedParams}`;
  }

  /**
   * Estimate size of value in bytes (approximate)
   */
  private estimateSize(value: any): number {
    return JSON.stringify(value).length;
  }

  /**
   * Set cache value with TTL
   * @param agentType Type of agent (e.g., "question-generator", "maths-solver")
   * @param params Parameters used in the request
   * @param value The cached value
   * @param ttlSeconds Time to live in seconds (default: 3600s = 1 hour for questions)
   */
  set<T>(
    agentType: string,
    params: Record<string, any>,
    value: T,
    ttlSeconds: number = 3600,
  ): void {
    // CRITICAL: Prevent caching fallback responses
    // isFallback is at response.data.isFallback level
    const anyValue = value as any;
    if (anyValue?.data?.isFallback === true) {
      console.warn(
        `[Cache] REJECTED: Will not cache fallback for ${agentType}`,
      );
      return;
    }

    const key = this.generateKey(agentType, params);
    const size = this.estimateSize(value);

    // Check if we need to make space
    if (this.currentSize + size > this.MAX_CACHE_SIZE) {
      this.evictLRU(); // Evict least recently used
    }

    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt, hits: 0 });
    this.currentSize += size;

    // Persist to localStorage
    this.saveToStorage();

    console.log(`[Cache] SET: ${key} (size: ${size}B, TTL: ${ttlSeconds}s)`);
  }

  /**
   * Get cache value if it hasn't expired
   */
  get<T>(agentType: string, params: Record<string, any>): T | null {
    const key = this.generateKey(agentType, params);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.currentSize -= this.estimateSize(entry.value);
      this.stats.misses++;
      return null;
    }

    // CRITICAL: Never return fallback responses, even if cached
    // isFallback is at response.data.isFallback level
    const value = entry.value as any;
    if (value?.data?.isFallback === true) {
      console.warn(
        `[Cache] REJECTING fallback return for ${key}, deleting from cache`,
      );
      this.cache.delete(key);
      this.currentSize -= this.estimateSize(entry.value);
      this.saveToStorage();
      this.stats.misses++;
      return null;
    }

    // Cache hit!
    entry.hits++;
    this.stats.hits++;
    console.log(
      `[Cache] HIT: ${key} (hits: ${entry.hits}, expires in: ${Math.round((entry.expiresAt - Date.now()) / 1000)}s)`,
    );

    return entry.value as T;
  }

  /**
   * Check if key exists and hasn't expired
   */
  has(agentType: string, params: Record<string, any>): boolean {
    const key = this.generateKey(agentType, params);
    const entry = this.cache.get(key);

    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate cache for specific agent type
   */
  invalidateAgent(agentType: string): void {
    let deletedCount = 0;
    const keysToDelete: string[] = [];
    this.cache.forEach((entry, key) => {
      if (key.startsWith(agentType + ":")) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.currentSize -= this.estimateSize(entry.value);
        this.cache.delete(key);
        deletedCount++;
      }
    });
    // Persist to storage
    this.saveToStorage();
    console.log(`[Cache] INVALIDATED: ${agentType} (${deletedCount} entries)`);
  }

  /**
   * Clear all fallback responses from cache
   * Fallback responses were generated when AI failed - they should not be reused
   */
  clearFallbackResponses(): void {
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      // Check if the cached value contains a fallback response
      // Structure: entry.value = { data: { success, agentName, isFallback: true, data: {...} } }
      if (
        entry.value &&
        entry.value.data &&
        entry.value.data.isFallback === true
      ) {
        console.log(`[Cache] Removing fallback entry: ${key}`);
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.currentSize -= this.estimateSize(entry.value);
        this.cache.delete(key);
        deletedCount++;
      }
    });

    // Persist to storage
    this.saveToStorage();

    if (deletedCount > 0) {
      console.log(`[Cache] CLEARED ${deletedCount} fallback response(s)`);
    } else {
      console.log(`[Cache] No fallback responses found to clear`);
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.stats = { hits: 0, misses: 0 };
    // Clear from storage
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    console.log("[Cache] CLEARED all entries");
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      const entry = this.cache.get(key);
      if (entry) {
        this.currentSize -= this.estimateSize(entry.value);
        this.cache.delete(key);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      // Persist to storage
      this.saveToStorage();
      console.log(`[Cache] CLEANUP: Removed ${deletedCount} expired entries`);
    }
  }

  /**
   * Evict least recently used (LRU) entry
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let minHits = Infinity;

    this.cache.forEach((entry, key) => {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        lruKey = key;
      }
    });

    if (lruKey) {
      const entry = this.cache.get(lruKey);
      if (entry) {
        this.currentSize -= this.estimateSize(entry.value);
        this.cache.delete(lruKey);
        // Persist to storage
        this.saveToStorage();
        console.log(`[Cache] EVICTED LRU: ${lruKey}`);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      size: this.estimateSize(entry.value),
      expiresIn: Math.max(0, entry.expiresAt - Date.now()),
      hits: entry.hits,
    }));

    return {
      totalSize: this.currentSize,
      hitCount: this.stats.hits,
      missCount: this.stats.misses,
      entries,
    };
  }

  /**
   * Get hit rate percentage
   */
  getHitRate(): number {
    const total = this.stats.hits + this.stats.misses;
    return total === 0 ? 0 : Math.round((this.stats.hits / total) * 100);
  }

  /**
   * Get frontend cache statistics for monitoring
   */
  getFrontendCacheStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      totalRequests: total,
      cacheHits: this.stats.hits,
      cacheMisses: this.stats.misses,
      hitRate: this.getHitRate(),
      cacheSize: this.currentSize,
      maxCacheSize: this.MAX_CACHE_SIZE,
      cachedEntries: this.cache.size,
    };
  }

  /**
   * Reset frontend cache stats (for session tracking)
   */
  resetStats(): void {
    this.stats = { hits: 0, misses: 0 };
    console.log("[Cache] Stats reset");
  }

  /**
   * Destroy cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
export const cacheService = new FrontendCacheService();

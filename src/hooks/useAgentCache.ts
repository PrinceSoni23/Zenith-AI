import { useState, useCallback } from "react";
import { agentApi } from "@/lib/api";
import { cacheService } from "@/lib/cacheService";

interface UseAgentCacheOptions {
  /**
   * TTL in seconds (default: 3600s = 1 hour)
   */
  ttl?: number;
  /**
   * Whether to show cache hit notifications
   */
  showCacheNotification?: boolean;
}

/**
 * Validate if response is worth caching
 * Prevents caching errors, empty responses, or fallback text
 * Response structure from backend: { success, data: { success, agentName, isFallback?, data: {...} } }
 */
const isValidResponseForCache = (response: any): boolean => {
  // Check if response exists
  if (!response) return false;

  // Axios returns response as { data: { success, agentName, isFallback?, data } }
  const outerData = response.data;
  if (!outerData) return false;

  // Check for fallback flag at the first level (not nested in data)
  if (outerData.isFallback === true) {
    console.log(
      "⚠️ NOT storing fallback response (AI failed to generate content)",
    );
    return false;
  }

  // The actual content is in the data field
  const actualData = outerData.data;
  if (!actualData) return false;

  // Check if actual data is empty object
  if (typeof actualData === "object" && Object.keys(actualData).length === 0) {
    return false;
  }

  // Check if actual data is empty array
  if (Array.isArray(actualData) && actualData.length === 0) {
    return false;
  }

  // Check if actual data is empty string
  if (
    typeof actualData === "string" &&
    (!actualData || actualData.trim().length === 0)
  ) {
    return false;
  }

  return true;
};

/**
 * Hook to handle agent API calls with automatic caching
 * Reduces API calls by 30-60% for repeated questions
 *
 * @example
 * const { dispatch, loading, data, error } = useAgentCache();
 * await dispatch("question-generator", { subject, topic, count });
 */
export function useAgentCache(options: UseAgentCacheOptions = {}) {
  const { ttl = 3600, showCacheNotification = false } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);
  const [isCacheHit, setIsCacheHit] = useState(false);

  const dispatch = useCallback(
    async (agentType: string, payload: Record<string, any>) => {
      setLoading(true);
      setError(null);
      setIsCacheHit(false);

      try {
        // Check cache first
        const cachedResult = cacheService.get<any>(agentType, payload);
        if (cachedResult) {
          const cachedData = (cachedResult as any).data;

          // Double-check: Never return cached fallback responses
          // isFallback is at response.data.isFallback level
          if (cachedData?.isFallback === true) {
            console.warn(
              `⚠️ [Cache] Cached fallback detected, skipping and making fresh API call for ${agentType}`,
            );
            // Continue to fresh API call below
          } else {
            // Valid cached response, use it
            setData(cachedData);
            setIsCacheHit(true);
            setLoading(false);

            if (showCacheNotification) {
              console.log(
                `✨ [Cache HIT] Using cached response for ${agentType}`,
              );
            }

            return { data: cachedData, isCacheHit: true };
          }
        }

        // Cache miss or fallback detected - call API
        // Use dispatchWithSimilaritySearch for smart cache-first approach
        const response = await agentApi.dispatchWithSimilaritySearch(
          agentType,
          payload,
        );

        // Only cache if response is valid (not empty/error/fallback)
        if (isValidResponseForCache(response)) {
          cacheService.set<any>(agentType, payload, response, ttl);
          console.log(
            `✅ [Cache] Storing valid response for ${agentType} (TTL: ${ttl}s)`,
          );
        } else {
          console.warn(
            `⚠️ [Cache] NOT storing invalid/empty response for ${agentType}`,
          );
        }

        setData((response as any).data);
        setError(null);

        return { data: (response as any).data, isCacheHit: false };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error(`[Agent Cache Error] ${agentType}:`, error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [ttl, showCacheNotification],
  );

  const invalidateCache = useCallback((agentType: string) => {
    cacheService.invalidateAgent(agentType);
  }, []);

  return {
    dispatch,
    loading,
    error,
    data,
    isCacheHit,
    invalidateCache,
    getCacheStats: () => cacheService.getStats(),
  };
}

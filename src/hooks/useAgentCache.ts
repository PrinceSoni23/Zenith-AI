import { useState, useCallback } from "react";
import axios from "axios";
import { useLanguage } from "@/context/LanguageContext";
import { agentApi } from "@/lib/api";
import { cacheService } from "@/lib/cacheService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
 * Translate cached response to a different language via backend endpoint
 * Used when user requests content in a language different from cached version
 * Uses axios client which automatically includes JWT auth token
 */
const translateCachedResponse = async (
  cachedData: any,
  targetLanguage: string,
): Promise<any> => {
  if (targetLanguage.toLowerCase() === "english") {
    // English cached, no translation needed
    return cachedData;
  }

  try {
    console.log(
      `🌐 [Translate Cache] Translating response to ${targetLanguage}...`,
    );

    // Create axios instance with auth interceptors
    const api = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });

    // Attach JWT token (same pattern as api.ts)
    api.interceptors.request.use(config => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    const response = await api.post("/translate", {
      content: cachedData,
      language: targetLanguage,
    });

    if (response.data?.success && response.data?.data) {
      console.log(
        `✨ [Translate Cache] Successfully translated to ${targetLanguage}`,
      );
      return response.data.data;
    }

    console.warn(
      `⚠️ [Translate Cache] Invalid response from translation endpoint, returning cached data`,
    );
    return cachedData;
  } catch (error) {
    console.error("[Translate Cache Error]", error);
    // Fallback to cached English content on error
    return cachedData;
  }
};

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
  const { language: userLanguage } = useLanguage();

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
        // Check cache first with language info
        const cachedResult = cacheService.getWithLanguage<any>(
          agentType,
          payload,
        );
        if (cachedResult) {
          const cachedData = (cachedResult as any).data.data;
          const cachedLanguage = (cachedResult as any).language;

          // Double-check: Never return cached fallback responses
          if (cachedData?.isFallback === true) {
            console.warn(
              `⚠️ [Cache] Cached fallback detected, skipping and making fresh API call for ${agentType}`,
            );
            // Continue to fresh API call below
          } else {
            // Valid cached response found

            // Check if language matches
            const normalizedUserLang = userLanguage.toLowerCase();
            const normalizedCachedLang = cachedLanguage.toLowerCase();

            if (normalizedUserLang === normalizedCachedLang) {
              // Language match! Use cached response as-is
              setData(cachedData);
              setIsCacheHit(true);
              setLoading(false);

              if (showCacheNotification) {
                console.log(
                  `✨ [Cache HIT] Using cached response for ${agentType} (language: ${normalizedCachedLang})`,
                );
              }

              return { data: cachedData, isCacheHit: true };
            } else {
              // Language mismatch! Translate cached response instead of new API call
              console.log(
                `🔄 [Cache] Language mismatch: cached=${normalizedCachedLang}, user=${normalizedUserLang}. Translating cached response...`,
              );

              const translatedData = await translateCachedResponse(
                cachedData,
                normalizedUserLang,
              );

              setData(translatedData);
              setIsCacheHit(true); // Still a cache hit, just translated
              setLoading(false);

              if (showCacheNotification) {
                console.log(
                  `✨ [Cache HIT + Translation] Used cached response translated to ${normalizedUserLang}`,
                );
              }

              return { data: translatedData, isCacheHit: true };
            }
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
          cacheService.set<any>(
            agentType,
            payload,
            response,
            ttl,
            userLanguage.toLowerCase(),
          );
          console.log(
            `✅ [Cache] Storing valid response for ${agentType} (language: ${userLanguage.toLowerCase()}, TTL: ${ttl}s)`,
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
    [ttl, showCacheNotification, userLanguage],
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

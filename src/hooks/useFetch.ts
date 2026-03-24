"use client";

import { useCallback } from "react";
import { useLoading } from "@/hooks/useLoading";

interface FetchOptions {
  message?: string;
  minDuration?: number;
}

/**
 * Hook for making API calls with automatic loader
 * Usage: const fetchData = useFetch();
 * await fetchData('https://api.example.com/data', { message: 'Fetching...' });
 */
export function useFetch() {
  const { showLoader, hideLoader, setMessage } = useLoading();

  const fetch = useCallback(
    async (url: string, options?: RequestInit & FetchOptions) => {
      const startTime = Date.now();
      const {
        message = "Loading...",
        minDuration = 300,
        ...fetchOptions
      } = options || {};

      showLoader();
      setMessage(message);

      try {
        const response = await global.fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        // Ensure minimum duration for smooth UX
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minDuration) {
          await new Promise(resolve =>
            setTimeout(resolve, minDuration - elapsedTime),
          );
        }

        hideLoader();
        return response;
      } catch (error) {
        hideLoader();
        throw error;
      }
    },
    [showLoader, hideLoader, setMessage],
  );

  return fetch;
}

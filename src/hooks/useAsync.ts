"use client";

import { useCallback } from "react";
import { useLoading } from "@/hooks/useLoading";

interface UseAsyncOptions {
  showMessage?: string;
  minDuration?: number;
}

/**
 * Hook for making async calls with automatic loader management
 * Ensures loader stays visible for at least minDuration (default: 300ms)
 */
export function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: E) => void,
  options?: UseAsyncOptions,
) {
  const { showLoader, hideLoader, setMessage } = useLoading();
  const { showMessage = "Loading...", minDuration = 300 } = options || {};

  const execute = useCallback(async () => {
    const startTime = Date.now();
    showLoader();
    if (showMessage) setMessage(showMessage);

    try {
      const response = await asyncFunction();

      // Ensure minimum duration for smooth UX
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minDuration) {
        await new Promise(resolve =>
          setTimeout(resolve, minDuration - elapsedTime),
        );
      }

      hideLoader();
      onSuccess?.(response);
      return response;
    } catch (error) {
      hideLoader();
      onError?.(error as E);
      throw error;
    }
  }, [
    asyncFunction,
    onSuccess,
    onError,
    showLoader,
    hideLoader,
    setMessage,
    showMessage,
    minDuration,
  ]);

  return execute;
}

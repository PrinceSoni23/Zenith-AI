/**
 * QueryClient Provider
 * Sets up React Query with optimized defaults for dashboard caching
 */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ── Caching Strategy ──
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
      retry: 2, // Retry failed requests twice
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

      // ── Network Strategy ──
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
      refetchOnReconnect: true, // Refetch when reconnected to internet
      refetchOnMount: "always", // Always refetch when component mounts
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default queryClient;

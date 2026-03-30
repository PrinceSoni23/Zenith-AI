"use client";

import React, { useEffect } from "react";
import { LoaderProvider } from "@/context/LoaderContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { GlobalClickInterceptor } from "@/components/GlobalClickInterceptor";
import { cacheService } from "@/lib/cacheService";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("[Boot] === CACHE CLEANUP START ===");

    // Only remove fallback responses, preserve all legitimate cached data
    // This ensures users keep their study materials while removing stale fallbacks
    cacheService.clearFallbackResponses();

    console.log("[Boot] === CACHE CLEANUP END ===");
  }, []);

  return (
    <LanguageProvider>
      <LoaderProvider>
        <GlobalClickInterceptor />
        <PageTransitionLoader />
        {children}
      </LoaderProvider>
    </LanguageProvider>
  );
}
